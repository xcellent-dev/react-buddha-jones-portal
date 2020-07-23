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

class CampaignRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediCampaign";

    public function __construct(EntityManager $entityManager) {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);
    }

    public function search($projectId, $search = '', $offset = 0, $length = 10)
    {
        $dql = "SELECT DISTINCT a 
                FROM \Application\Entity\RediCampaign a 
                LEFT JOIN \Application\Entity\RediProjectToCampaign ptc 
                  WITH a.id=ptc.campaignId";

        $dqlFilter = [];

        if ($projectId) {
            $dqlFilter[] = "ptc.projectId= " . (int)$projectId;
        }

        if ($search) {
            $dqlFilter[] = "(a.campaignName LIKE '%" . $search . "%' )";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $dql .= " ORDER BY a.id ASC";
        
        $query = $this->getEntityManager()->createQuery($dql);
        $query->setFirstResult($offset);
        $query->setMaxResults($length);
        $data = $query->getArrayResult();

        foreach($data as &$row) {
            $row['id'] = (int)$row['id'];
            $row['project'] = $this->getCampaignProject($row['id']);
        }

        return $data;
    }

    public function getCampaignProject($campaignId)
    {
        $dql = "SELECT ptc.id AS projectCampaignEntryId, p.id, p.projectName
                FROM \Application\Entity\RediProjectToCampaign ptc 
                INNER JOIN \Application\Entity\RediProject p
                  WITH p.id=ptc.projectId 
                WHERE ptc.campaignId=:campaign_id 
                ORDER BY p.id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('campaign_id', $campaignId);
        $data = $query->getArrayResult();

        foreach($data as &$row) {
            $row['manager'] = $this->getCampaignProjectManager($row['projectCampaignEntryId']);
            $row['producer'] = $this->getCampaignProjectProducer($row['projectCampaignEntryId']);

            unset($row['projectCampaignEntryId']);
        }

        return $data;
    }

    public function getCampaignProjectManager($projectCampaignEntryId)
    {
        $dql = "SELECT pcm.managerId
                FROM \Application\Entity\RediProjectCampaignManager pcm 
                WHERE pcm.projectCampaignId=:project_campaign_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('project_campaign_id', $projectCampaignEntryId);
        $data =  $query->getArrayResult();

        $result = array();

        foreach($data as $manager) {
            $result[] = $manager['managerId'];
        }

        return $result;
    }

    public function getCampaignProjectProducer($projectCampaignEntryId)
    {
        $dql = "SELECT pcm.producerId
                FROM \Application\Entity\RediProjectCampaignProducer pcm 
                WHERE pcm.projectCampaignId=:project_campaign_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('project_campaign_id', $projectCampaignEntryId);
        $data =  $query->getArrayResult();

        $result = array();

        foreach($data as $manager) {
            $result[] = $manager['producerId'];
        }

        return $result;
    }

    public function searchCount($projectId, $search = '')
    {
        $dql = "SELECT  COUNT(DISTINCT a.id) AS total_count 
                FROM \Application\Entity\RediCampaign a 
                LEFT JOIN \Application\Entity\RediProjectToCampaign ptc 
                  WITH a.id=ptc.campaignId";

        $dqlFilter = [];

        if ($projectId) {
            $dqlFilter[] = "ptc.projectId= " . (int)$projectId;
        }

        if ($search) {
            $dqlFilter[] = "(a.campaignName LIKE '%" . $search . "%' )";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $query = $this->getEntityManager()->createQuery($dql);
        $result =  $query->getArrayResult();

        return (isset($result[0]['total_count'])?(int)$result[0]['total_count']:0);
    }
}
