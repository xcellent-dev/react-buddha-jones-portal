<?php
namespace Application\Entity\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManager;
use Zend\Config\Config;

// before called Table now Repository Table Data Gateway
// In Bug Entity add  @Entity(repositoryClass="BugRepository")
// To be able to use this query logic through
// $this->getEntityManager()->getRepository('Bug') we have to adjust the metadata slightly.
// http://stackoverflow.com/questions/10481916/the-method-name-must-start-with-either-findby-or-findoneby-uncaught-exception

class ProjectRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediProject";

    public function __construct(EntityManager $entityManager)
    {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);
    }

    public function search($filter = array(), $offset = 0, $length = 10, $returnSingleResult=false)
    {
        $dql = "SELECT
                  p.id, p.projectName, p.customerId, c.customerName,
                  p.firstPointOfContactId,
                  p.notes,  MAX(ph.createdAt) as lastUpdatedAt
                FROM \Application\Entity\RediProject p
                LEFT JOIN \Application\Entity\RediProjectHistory ph
                  WITH p.id=ph.projectId
                LEFT JOIN \Application\Entity\RediCustomer c
                  WITH c.id=p.customerId ";

        $dqlFilter = [];

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (p.projectName LIKE :search ) ";
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $dqlFilter[] = " p.customerId=:customer_id ";
        }

        if (isset($filter['project_id']) && $filter['project_id']) {
            $dqlFilter[] = " p.id=:project_id ";
        }

        if (count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }


        $dql .= ' GROUP BY p.id ';

        if ($filter['sort'] == 'name') {
            $dql .= " ORDER BY p.projectName ASC ";
        } else if ($filter['sort'] == 'last_update_date') {
            $dql .= " ORDER BY lastUpdatedAt DESC";
        } else {
            $dql .= " ORDER BY p.id ASC ";
        }

        $query = $this->getEntityManager()->createQuery($dql);

        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $query->setParameter('customer_id', $filter['customer_id']);
        }

        if (isset($filter['project_id']) && $filter['project_id']) {
            $query->setParameter('project_id', $filter['project_id']);
        }


        $query->setFirstResult($offset);
        $query->setMaxResults($length);

        $result = $query->getArrayResult();


        foreach ($result as &$row) {
            $row['lastUpdateUser'] = $this->getLastUpdateUserByProjectId($row['id'], $filter['image_path']);
            $row['campaign'] = $this->getCapaignByProjectId($row['id']);
            $row['comment'] = $this->getCommentByProjectId($row['id']);

            if($returnSingleResult) {
                foreach ($row['campaign'] as &$campaign) {
                    $campaign['manager'] = $this->getManagerByProjectAndCampaign($row['id'], $campaign['campaignId']);
                    $campaign['producer'] = $this->getProducerByProjectAndCampaign($row['id'], $campaign['campaignId']);
                    $campaign['spot'] = $this->getSpotByProjectAndCampaign($row['id'], $campaign['campaignId']);
                }

                $row['history'] = $this->getHistoryByProjectId($row['id'], $filter['image_path']);
            }
        }


        return $result;
    }


//    public function getMangerByProjectId($projectId)
//    {
//        $dql = "SELECT pm.managerId
//                FROM \Application\Entity\RediProjectManager pm
//                WHERE pm.projectId=:project_id";
//
//        $query = $this->getEntityManager()->createQuery($dql);
//        $query->setParameter('project_id', $projectId);
//        $query->execute();
//        $result = $query->getArrayResult();
//
//        $response = array();
//
//        foreach ($result as $row) {
//            $response[] = (int)$row['managerId'];
//        }
//
//        return $response;
//    }
//
//    public function getProducerByProjectId($projectId)
//    {
//        $dql = "SELECT pp.producerId
//                FROM \Application\Entity\RediProjectProducer pp
//                WHERE pp.projectId=:project_id";
//
//        $query = $this->getEntityManager()->createQuery($dql);
//        $query->setParameter('project_id', $projectId);
//        $query->execute();
//        $result = $query->getArrayResult();
//
//        $response = array();
//
//        foreach ($result as $row) {
//            $response[] = (int)$row['producerId'];
//        }
//
//        return $response;
//    }

    public function getCapaignByProjectId($projectId)
    {
        $dql = "SELECT c.id, c.campaignName
                FROM \Application\Entity\RediProjectToCampaign ptc
                INNER JOIN \Application\Entity\RediCampaign c
                  WITH ptc.campaignId=c.id
                WHERE ptc.projectId=:project_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('project_id', $projectId);
        $query->execute();
        $result = $query->getArrayResult();

        $response = array();

        foreach ($result as $row) {
            $response[] = array(
                'campaignId' => (int)$row['id'],
                'campaignName' => $row['campaignName']
            );
        }

        return $response;
    }

    public function getCommentByProjectId($projectId)
    {
        $dql = "SELECT
                  COUNT(c.id) AS total_count,
                  MIN(c.comment_read) AS read_c
                FROM
                  redi_comment c
                WHERE c.parent_id = :project_id
                  AND c.type_id = 3
                GROUP BY c.id ";

        $query = $this->getEntityManager()->getConnection()->prepare($dql);
        $query->bindParam('project_id', $projectId);
        $query->execute();

        $result = $query->fetchAll();

        if (isset($result[0])) {
            $response = array(
                'count' => (int)$result[0]['total_count'],
                'unread' => ($result[0]['read_c']) ? 0 : 1
            );
        } else {
            $response = array(
                'count' => 0,
                'unread' => 0
            );
        }

        return $response;
    }

    public function getLastUpdateUserByProjectId($projectId, $imagePath)
    {
        $dql = "SELECT
                    ph2.user_id, u.first_name, u.last_name, u.image
                  FROM
                    redi_project_history ph2
                  INNER JOIN redi_user u
                    ON u.id=ph2.user_id
                  WHERE ph2.project_id = :project_id
                  ORDER BY created_at DESC
                  LIMIT 1";

        $query = $this->getEntityManager()->getConnection()->prepare($dql);
        $query->bindParam('project_id', $projectId);
        $query->execute();

        $result = $query->fetchAll();

        $response = array();

        if (isset($result[0])) {
            $response = array(
                'userId' => (int)$result[0]['user_id'],
                'name' => trim($result[0]['first_name'] . ' ' . $result[0]['last_name']),
                'image' => ($result[0]['image'])?$imagePath . $result[0]['image']: null
            );
        }

        return $response;
    }

    public function searchDetailed($filter = array(), $offset = 0, $length = 10, $returnSingleResult=false)
    {
        $dql = "SELECT
                  p.id,
                  p.project_name AS projectName,
                  p.customer_id AS customerId,
                  c.customer_name AS customerName,
                  p.first_point_of_contact_id AS firstPointOfContactId,
                  p.notes,
                  MAX(ph.created_at) AS lastUpdatedAt,
                  (SELECT
                    user_id
                  FROM
                    redi_project_history ph2
                  WHERE ph2.project_id = p.id
                  ORDER BY created_at DESC
                  LIMIT 1) AS lastUpdateUserId,
                  (SELECT
                    CONCAT(
                      IFNULL(u.first_name, ''),
                      ' ',
                      IFNULL(u.last_name, '')
                    )
                  FROM
                    redi_project_history ph3
                    INNER JOIN redi_user u
                      ON ph3.user_id = u.id
                  WHERE ph3.project_id = p.id
                  ORDER BY created_at DESC
                  LIMIT 1) AS lastUpdateUserName,
                  COUNT(ph.id) AS historyCount
                FROM
                  redi_project p
                  LEFT JOIN redi_customer c
                    ON p.customer_id = c.id
                  LEFT JOIN redi_project_history ph
                    ON p.id = ph.project_id  ";

        $dqlFilter = [];

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (p.project_name LIKE :search ) ";
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $dqlFilter[] = " p.customer_id=:customer_id ";
        }

        if (isset($filter['project_id']) && $filter['project_id']) {
            $dqlFilter[] = " p.id=:project_id ";
        }

        if (count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }


        $dql .= " GROUP BY p.id ";

        if ($filter['sort'] == 'name') {
            $dql .= " ORDER BY p.projectName ASC ";
        } else if ($filter['sort'] == 'last_update_date') {
            $dql .= " ORDER BY lastUpdatedAt DESC";
        } else {
            $dql .= " ORDER BY p.id ASC ";
        }

        $dql .= " LIMIT " . $offset . "," . $length;

        $query = $this->getEntityManager()->getConnection()->prepare($dql);

        if (isset($filter['search']) && $filter['search']) {
            $searchLike = '%' . $filter['search'] . '%';
            $query->bindParam('search', $searchLike);
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $query->bindParam('customer_id', $filter['customer_id']);
        }

        if (isset($filter['project_id']) && $filter['project_id']) {
            $query->bindParam('project_id', $filter['project_id']);
        }

        $query->execute();

        $data = $query->fetchAll();

        foreach ($data as &$row) {
            $row['id'] = (int)$row['id'];
            $row['customerId'] = (int)$row['customerId'];
            $row['lastUpdateUserId'] = ($row['lastUpdateUserId']) ? (int)$row['lastUpdateUserId'] : null;
            $row['historyCount'] = (int)$row['historyCount'];
            $row['lastUpdateUserName'] = trim($row['lastUpdateUserName']);

            $row['campaign'] = $this->getPojectCampaign($row['id']);

            $row['lastUpdateUser'] = $this->getLastUpdateUserByProjectId($row['id'], $filter['image_path']);
//                $row['campaigns'] = $this->getCapaignByProjectId($row['id']);
            $row['comment'] = $this->getCommentByProjectId($row['id']);

            if($returnSingleResult) {
                foreach ($row['campaign'] as &$campaign) {
                    $campaign['manager'] = $this->getManagerByProjectAndCampaign($row['id'], $campaign['campaignId']);
                    $campaign['producer'] = $this->getProducerByProjectAndCampaign($row['id'], $campaign['campaignId']);
                    $campaign['spot'] = $this->getSpotByProjectAndCampaign($row['id'], $campaign['campaignId']);
                }

                $row['history'] = $this->getHistoryByProjectId($row['id'], $filter['image_path']);
            }

        }

        return $data;
    }

    public function searchCount($filter = array())
    {
        $dql = "SELECT COUNT(a.id) AS total_count
                FROM \Application\Entity\RediProject a ";


        $dqlFilter = [];

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (a.projectName LIKE :search ) ";
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $dqlFilter[] = " a.customerId=:customer_id ";
        }

        if (count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $query = $this->getEntityManager()->createQuery($dql);
        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $query->setParameter('customer_id', $filter['customer_id']);
        }
        $result = $query->getArrayResult();

        return (isset($result[0]['total_count']) ? (int)$result[0]['total_count'] : 0);
    }

    public function getPojectCampaign($projectId)
    {
        $dql = "SELECT ptc.campaignId, c.campaignName
                FROM \Application\Entity\RediProjectToCampaign ptc
                 INNER JOIN \Application\Entity\RediCampaign c
                  WITH ptc.campaignId=c.id
                WHERE ptc.projectId=:project_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('project_id', $projectId);
        return $query->getArrayResult();
    }

    public function getAllProjectEditorSataus()
    {
        $dql = "SELECT
                  pes
                FROM \Application\Entity\RediProjectEditorStatus pes ";

        $query = $this->getEntityManager()->createQuery($dql);
        return $query->getArrayResult();
    }

    public function getFullEditorProject($editorId = null, $offlset = 0, $lenght = 20)
    {
        $dql = "SELECT
                  p.id AS projectId,
                  p.projectName,
                  c.id AS campaignId,
                  c.campaignName,
                  s.id AS spotId,
                  s.spotName,
                  u.id AS editorUserId,
                  u.username as editorUserName,
                  CONCAT(u.firstName, ' ', u.lastName) AS editorFullName,
                  pep.notes,
                  pep.watched,
                  pep.brokenDown,
                  pep.due,
                  pep.dueDate,
                  pep.statusId,
                  pes.statusName,
                  pep.updatedAt
                FROM
                  \Application\Entity\RediEditorToSpot ets
                  INNER JOIN \Application\Entity\RediSpot s
                    WITH s.id = ets.spotId
                  INNER JOIN \Application\Entity\RediProject p
                    WITH p.id = s.projectId
                  INNER JOIN \Application\Entity\RediCampaign c
                    WITH c.id = s.campaignId
                  LEFT JOIN \Application\Entity\RediProjectEditorProgress pep
                    WITH pep.spotId = s.id
                    AND pep.projectId = s.projectId
                    AND pep.campaignId = s.campaignId
                  LEFT JOIN \Application\Entity\RediProjectEditorStatus pes
                    WITH pes.id = pep.statusId
                  INNER JOIN \Application\Entity\RediUser u
                    WITH u.id=ets.editorId ";

        if ($editorId) {
            $dql .= " WHERE ets.editorId = :editor_id ";
        }

        $dql .= " ORDER BY ets.editorId ASC, p.projectName ASC, pep.updatedAt DESC ";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setFirstResult($offlset);
        $query->setMaxResults($lenght);

        if ($editorId) {
            $query->setParameter('editor_id', $editorId);
        }

        $result = $query->getArrayResult();

        foreach ($result as &$row) {
            if ($row['dueDate']) {
                $row['dueDate'] = $row['dueDate']->format('Y-m-d');
            }

            if ($row['updatedAt']) {
                $row['updatedAt'] = $row['updatedAt']->format('Y-m-d H:i:s');
            }
        }

        return $result;
    }

    public function getManagerByProjectAndCampaign($projectId, $campaignId)
    {
        $dql = "SELECT pcm.managerId AS id, u.username, CONCAT(u.firstName, ' ', u.lastName) AS fullName
                FROM \Application\Entity\RediProjectToCampaign ptc
                INNER JOIN \Application\Entity\RediProjectCampaignManager pcm
                  WITH ptc.id=pcm.projectCampaignId
                INNER JOIN \Application\Entity\RediUser u
                  WITH u.id=pcm.managerId
                WHERE
                  ptc.projectId=:project_id
                  AND ptc.campaignId=:campaign_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('project_id', $projectId);
        $query->setParameter('campaign_id', $campaignId);
        $data =  $query->getArrayResult();

        return $data;
    }

    /**
     * Get producer ID by Project ID and Campaign
     *
     * @param $projectId
     * @param $campaignId
     * @return array
     */
    public function getProducerByProjectAndCampaign($projectId, $campaignId)
    {
        $dql = "SELECT pcm.producerId AS id, u.username, CONCAT(u.firstName, ' ', u.lastName) AS fullName
                FROM \Application\Entity\RediProjectToCampaign ptc
                INNER JOIN \Application\Entity\RediProjectCampaignProducer pcm
                  WITH ptc.id=pcm.projectCampaignId
                INNER JOIN \Application\Entity\RediUser u
                  WITH u.id=pcm.producerId
                WHERE
                  ptc.projectId=:project_id
                  AND ptc.campaignId=:campaign_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('project_id', $projectId);
        $query->setParameter('campaign_id', $campaignId);
        $data =  $query->getArrayResult();


        return $data;
    }

    public function getSpotByProjectAndCampaign($projectId, $campaignId)
    {
        $dql = "SELECT s.id, s.spotName, s.revisionNotCounted, s.notes, s.revisions, s.graphicsRevisions, s.firstRevisionCost
                FROM \Application\Entity\RediSpot s
                WHERE
                  s.projectId=:project_id
                  AND s.campaignId=:campaign_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('project_id', $projectId);
        $query->setParameter('campaign_id', $campaignId);
        $data =  $query->getArrayResult();

        foreach($data as &$row) {
            $row['version'] = $this->getVersionBySpot($row['id']);
        }

        return $data;
    }

    public function getVersionBySpot($spotId)
    {
        $dql = "SELECT v
                FROM \Application\Entity\RediSpotVersion sv
                INNER JOIN \Application\Entity\RediVersion v
                  WITH sv.versionId=v.id
                WHERE
                  sv.spotId=:spot_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('spot_id', $spotId);
        $data =  $query->getArrayResult();

        return $data;
    }

    public function getHistoryByProjectId($projectId, $imagePath)
    {
        $dql = "SELECT
                  ph.id, ph.message, ph.userId, u.username, u.firstName, u.lastName, '' AS fullName,
                  u.image, ph.createdAt
                FROM \Application\Entity\RediProjectHistory ph
                INNER JOIN \Application\Entity\RediUser u
                  WITH ph.userId=u.id
                WHERE
                  ph.projectId=:project_id
                ORDER BY ph.createdAt DESC";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('project_id', $projectId);
        $data =  $query->getArrayResult();

        foreach($data as &$row) {
            $row['fullName'] = trim($row['firstName']  . ' ' . $row['lastName']);

            if($row['image']) {
                $row['image'] = $imagePath . $row['image'];
            } else {
                $row['image'] = null;
            }

            $row['createdAt'] = $row['createdAt']->format('Y-m-d H:i:s');
        }

        return $data;
    }
}
