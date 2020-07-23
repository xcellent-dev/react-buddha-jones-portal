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

class SpotRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediSpot";

    public function __construct(EntityManager $entityManager) {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);
    }

    public function search($projectId, $campaignId, $search = '', $offset = 0, $length = 10)
    {
        $dql = "SELECT a 
                FROM \Application\Entity\RediSpot a ";


        $dqlFilter = [];

        if ($projectId) {
            $dqlFilter[] = "a.projectId= " . (int)$projectId;
        }

        if ($campaignId) {
            $dqlFilter[] = "a.campaignId= " . (int)$campaignId;
        }

        if ($search) {
            $dqlFilter[] = "(a.spotName LIKE '%" . $search . "%' )";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $dql .= " ORDER BY a.id ASC";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setFirstResult($offset);
        $query->setMaxResults($length);
        $result = $query->getArrayResult();

        foreach($result as &$row) {
            $row['id'] = (int)$row['id'];
        }

        return $result;
    }
    public function searchCount($projectId, $campaignId, $search = '')
    {
        $dql = "SELECT COUNT(a.id) AS total_count 
                FROM \Application\Entity\RediSpot a ";


        $dqlFilter = [];

        if ($projectId) {
            $dqlFilter[] = "a.projectId= " . (int)$projectId;
        }

        if ($campaignId) {
            $dqlFilter[] = "a.campaignId= " . (int)$campaignId;
        }

        if ($search) {
            $dqlFilter[] = "(a.spotName LIKE '%" . $search . "%' )";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $dql .= " ORDER BY a.id ASC";

        $query = $this->getEntityManager()->createQuery($dql);
        $result =  $query->getArrayResult();

        return (isset($result[0]['total_count'])?(int)$result[0]['total_count']:0);
    }

    public function getById($spotId)
    {
        $dql = "SELECT a 
                FROM \Application\Entity\RediSpot a 
                WHERE a.id=:spot_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setMaxResults(1);
        $query->setParameter('spot_id', $spotId);

        $data = $query->getArrayResult();

        return (isset($data[0])?$data[0]:null);
    }


    public function getSpotSent($sentSpotId)
    {
        $dql = "SELECT 
                  sc.id,
                  sc.workTypeId,
                  wt.workType,
                  sc.sentViaMethodId,
                  ssvm.name AS sentViaMethod,
                  ssvmp.id AS sentViaMethodParentId,
                  ssvmp.name AS sentViaMethodParent,
                  sc.date,
                  sc.notes,
                  sc.statusId,
                  st.status,
                  sc.final
                FROM \Application\Entity\RediSpotSent sc
                LEFT JOIN \Application\Entity\RediWorkType wt
                  WITH sc.workTypeId=wt.id
                LEFT JOIN \Application\Entity\RediSpotSentViaMethod ssvm
                  WITH sc.sentViaMethodId=ssvm.id
                LEFT JOIN \Application\Entity\RediSpotSentViaMethod ssvmp
                  WITH ssvm.parentId=ssvmp.id
                LEFT JOIN \Application\Entity\RediStatus st 
                  WITH sc.statusId=st.id 
                 WHERE sc.id=:sent_spot_id ";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('sent_spot_id', $sentSpotId);
        $query->setMaxResults(1);

        $result = $query->getArrayResult();

        if($result && isset($result[0])) {
            $response = $result[0];
            $response['id'] = (int)$result[0]['id'];
            $response['final'] = (int)$result[0]['final'];
            $response['date'] = $result[0]['date']->format('Y-m-d');
            $response['projectSpotVersion'] = $this->getSpotVersionBySpotSentId($response['id'], true);
            $response['customerContact'] = $this->getSpotSentCustomerContact($response['id']);
            $response['workStage'] = $this->getSpotSentWorkStage($response['id']);
        } else {
            $response = null;
        }

        return $response;
    }

    public function searchSpotSent($workTypeId=null, $sentViaMethodId=null, $statusId= null, $offset = 0, $length = 10)
    {
        $dql = "SELECT 
                  sc.id,
                  sc.workTypeId,
                  wt.workType,
                  sc.sentViaMethodId,
                  ssvm.name AS sentViaMethod,
                  ssvmp.id AS sentViaMethodParentId,
                  ssvmp.name AS sentViaMethodParent,
                  sc.date,
                  sc.notes,
                  sc.statusId,
                  st.status,
                  sc.final
                FROM \Application\Entity\RediSpotSent sc
                LEFT JOIN \Application\Entity\RediWorkType wt
                  WITH sc.workTypeId=wt.id
                LEFT JOIN \Application\Entity\RediSpotSentViaMethod ssvm
                  WITH sc.sentViaMethodId=ssvm.id
                LEFT JOIN \Application\Entity\RediSpotSentViaMethod ssvmp
                  WITH ssvm.parentId=ssvmp.id
                LEFT JOIN \Application\Entity\RediStatus st 
                  WITH sc.statusId=st.id";


        $dqlFilter = [];

        if ($workTypeId) {
            $dqlFilter[] = "sc.workTypeId= :work_type_id";
        }

        if ($sentViaMethodId) {
            $dqlFilter[] = "sc.sentMethodViaId = :sent_method_via_id";
        }

        if ($statusId) {
            $dqlFilter[] = "sc.statusId = :status_id";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $dql .= " ORDER BY sc.id ASC";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setFirstResult($offset);
        $query->setMaxResults($length);

        if ($workTypeId) {
            $query->setParameter("project_id", $workTypeId);
        }

        if ($sentViaMethodId) {
            $query->setParameter("sent_method_via_id", $sentViaMethodId);
        }

        if ($statusId) {
            $query->setParameter("status_id", $statusId);
        }

        $result = $query->getArrayResult();

        foreach($result as &$row) {
            $row['id'] = (int)$row['id'];
            $row['final'] = (int)$row['final'];
            $row['date'] = $row['date']->format('Y-m-d');
            $row['projectSpotVersion'] = $this->getSpotVersionBySpotSentId($row['id']);
        }

        return $result;
    }
    
    public function searchSpotSentCount($workTypeId=null, $sentViaMethodId=null, $statusId= null)
    {
        $dql = "SELECT COUNT(sc.id) AS total_count 
                FROM \Application\Entity\RediSpotSent sc ";


        $dqlFilter = [];

        if ($workTypeId) {
            $dqlFilter[] = "sc.workTypeId= :work_type_id";
        }

        if ($sentViaMethodId) {
            $dqlFilter[] = "sc.sentMethodViaId = :sent_method_via_id";
        }

        if ($statusId) {
            $dqlFilter[] = "sc.statusId = :status_id";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $query = $this->getEntityManager()->createQuery($dql);

        if ($workTypeId) {
            $query->setParameter("project_id", $workTypeId);
        }

        if ($sentViaMethodId) {
            $query->setParameter("sent_method_via_id", $sentViaMethodId);
        }

        if ($statusId) {
            $query->setParameter("status_id", $statusId);
        }

        $result =  $query->getArrayResult();

        return (isset($result[0]['total_count'])?(int)$result[0]['total_count']:0);
    }

    public function validateWorkStageForSpotSent($workStage)
    {
        if(count($workStage)) {
            $dql = "SELECT DISTINCT COALESCE(ws.parentId, 0) as distinctParentId
                FROM \Application\Entity\RediWorkStage ws 
                WHERE ws.id IN (:work_stage_ids)";

            $query = $this->getEntityManager()->createQuery($dql);
            $query->setParameter("work_stage_ids", $workStage);

            $result =  $query->getArrayResult();

            $response = (count($result)<=1) ? true : false;
        } else {
            $response = true;
        }

        return $response;
    }

    public function getSpotVersionBySpotSentId($spotSentId, $returnWorker=false)
    {
        if($returnWorker){
            $extraSelect = ",sstsv.id ";
        } else {
            $extraSelect = "";
        }
        $dql = "SELECT 
                  sstsv.spotId, s.spotName,
                  sstsv.versionId, v.versionName,
                  p.id as projectId, p.projectName,
                  c.id as campaignId, c.campaignName" . $extraSelect . "
                FROM \Application\Entity\RediSpotSentToSpotVersion sstsv 
                INNER JOIN \Application\Entity\RediSpotSent ss
                  WITH ss.id=:spot_sent_id
                INNER JOIN \Application\Entity\RediSpot s
                  WITH s.id=sstsv.spotId
                LEFT JOIN \Application\Entity\RediProject p
                  WITH p.id=s.projectId
                LEFT JOIN \Application\Entity\RediCampaign c
                  WITH c.id=s.campaignId
                LEFT JOIN \Application\Entity\RediVersion v 
                   WITH v.id=sstsv.versionId
                WHERE sstsv.spotSentId=:spot_sent_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter("spot_sent_id", $spotSentId);

        $result =  $query->getArrayResult();

        if($returnWorker) {
            foreach($result as &$row) {
                $dql1 = "SELECT 
                  u.id, u.username, u.email, u.firstName, u.lastName, ut.typeName
                FROM \Application\Entity\RediSpotSentToSpotVersionToEditorDesigner sed 
                INNER JOIN \Application\Entity\RediUser u
                  WITH sed.editorDesignerId=u.id
                INNER JOIN \Application\Entity\RediUserType ut
                  WITH u.typeId=ut.id
                WHERE sed.spotSentSpotVersionId=:spot_sent_spot_version_id";

                $query1 = $this->getEntityManager()->createQuery($dql1);
                $query1->setParameter("spot_sent_spot_version_id", $row['id']);

                $result1 =  $query1->getArrayResult();


                foreach($result1 as $row1) {
                    $row['worker'][strtolower($row1['typeName'])][] = $row1;
                }

                unset($row['id']);
            }
        }

        return $result;
    }

    public function getSpotSentCustomerContact($spotSentId)
    {
        $dql = "SELECT 
                  cc
                FROM \Application\Entity\RediSpotSentToCustomerContact sstcc
                INNER JOIN \Application\Entity\RediCustomerContact cc
                  WITH sstcc.customerContactId=cc.id
                WHERE sstcc.spotSentId=:spot_sent_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter("spot_sent_id", $spotSentId);

        $result =  $query->getArrayResult();

        return $result;
    }

    public function getSpotSentWorkStage($spotSentId)
    {
        $dql = "SELECT 
                  ws.id, ws.workStage,
                  wsp.id AS parentId, wsp.workStage AS parentWorkStage
                FROM \Application\Entity\RediSpotSentToWorkStage ssws
                INNER JOIN \Application\Entity\RediWorkStage ws
                  WITH ssws.workStageId=ws.id
                LEFT JOIN \Application\Entity\RediWorkStage wsp
                  WITH ws.parentId=wsp.id
                WHERE ssws.spotSentId=:spot_sent_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter("spot_sent_id", $spotSentId);

        $result =  $query->getArrayResult();

        return $result;
    }

    public function clearSpotSentSpotVersion($spotSentId)
    {
        $dql1 = "DELETE
                FROM \Application\Entity\RediSpotSentToSpotVersionToEditorDesigner s
                WHERE s.spotSentSpotVersionId 
                IN (
                  SELECT 
                    sv.id 
                  FROM \Application\Entity\RediSpotSentToSpotVersion sv 
                  WHERE sv.spotSentId=:spot_sent_id
                )";

        $query1 = $this->getEntityManager()->createQuery($dql1);
        $query1->setParameter("spot_sent_id", $spotSentId);

        $query1->execute();

        $dql2 = "DELETE
                FROM \Application\Entity\RediSpotSentToSpotVersion sv 
                WHERE sv.spotSentId=:spot_sent_id";

        $query2 = $this->getEntityManager()->createQuery($dql2);
        $query2->setParameter("spot_sent_id", $spotSentId);

        $query2->execute();


    }
}
