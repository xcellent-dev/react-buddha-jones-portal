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

class TimeEntryRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediTimeEntry";

    public function __construct(EntityManager $entityManager) {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);
    }

    public function search($offset = 0, $length = 10, $filter=array())
    {
        $dql = "SELECT 
                  a.id, a.userId,
                  a.projectId, p.projectName, 
                  a.campaignId, c.campaignName, 
                  a.spotId, s.spotName,
                  a.versionId, v.versionName, 
                  a.activityTypeId, ac.value AS activityValue, a.activityDescription, 
                  ac.label AS activityLabel,
                  a.startDate, a.duration, 
                  a.notes, a.status, st.status as statusName
                FROM \Application\Entity\RediTimeEntry a 
                LEFT JOIN \Application\Entity\RediSpot s
                  WITH a.spotId=s.id
                LEFT JOIN \Application\Entity\RediProject p
                  WITH p.id=a.projectId
                LEFT JOIN \Application\Entity\RediCampaign c
                  WITH c.id=a.campaignId
                LEFT JOIN \Application\Entity\RediVersion v
                  WITH v.id=a.versionId
                LEFT JOIN \Application\Entity\RediActivity ac
                  WITH ac.id=a.activityTypeId
                LEFT JOIN \Application\Entity\RediStatus st
                  WITH a.status=st.id";

        $dqlFilter = [];

        if (isset($filter['user_id']) && $filter['user_id']) {
            $dqlFilter[] = " a.userId=:user_id ";
        }

        if (isset($filter['start_date']) && $filter['start_date']) {
            $dqlFilter[] = " a.startDate>=:start_date ";
        }

        if (isset($filter['end_date']) && $filter['end_date']) {
            $dqlFilter[] = " a.startDate<=:end_date ";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " .  implode(" AND ", $dqlFilter);
        }

        $dql .= " ORDER BY a.id ASC";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setFirstResult($offset);
        $query->setMaxResults($length);

        if (isset($filter['user_id']) && $filter['user_id']) {
            $query->setParameter('user_id', $filter['user_id']);
        }

        if (isset($filter['start_date']) && $filter['start_date']) {
            $query->setParameter('start_date', $filter['start_date']);
        }

        if (isset($filter['end_date']) && $filter['end_date']) {
            $query->setParameter('end_date', $filter['end_date']);
        }

        $result = $query->getArrayResult();

        foreach($result as &$row) {
            if($row['startDate']) {
                $row['startDate'] = $row['startDate']->format('Y-m-d H:i:s');
            }

            $row['id'] = (int)$row['id'];
        }

        return $result;
    }

    public function searchCount($filter=array())
    {
        $dql = "SELECT 
                  COUNT(a.id) AS total_count
                FROM \Application\Entity\RediTimeEntry a ";

        $dqlFilter = [];

        if (isset($filter['user_id']) && $filter['user_id']) {
            $dqlFilter[] = " a.userId=:user_id ";
        }

        if (isset($filter['start_date']) && $filter['start_date']) {
            $dqlFilter[] = " a.startDate>=:start_date ";
        }

        if (isset($filter['end_date']) && $filter['end_date']) {
            $dqlFilter[] = " a.startDate<=:end_date ";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " .  implode(" AND ", $dqlFilter);
        }

        $query = $this->getEntityManager()->createQuery($dql);

        if (isset($filter['user_id']) && $filter['user_id']) {
            $query->setParameter('user_id', $filter['user_id']);
        }

        if (isset($filter['start_date']) && $filter['start_date']) {
            $query->setParameter('start_date', $filter['start_date']);
        }

        if (isset($filter['end_date']) && $filter['end_date']) {
            $query->setParameter('end_date', $filter['end_date']);
        }

        $result = $query->getArrayResult();

        return (isset($result[0]['total_count'])?(int)$result[0]['total_count']:0);
    }

    public function searchUserTimeEntry($startDate, $endDate, $userId)
    {
        $startDate = new \DateTime($startDate);
        $endDate = new \DateTime($endDate);

        $startDate = $startDate->format('Y-m-d 00:00:00');
        $endDate = $endDate->format('Y-m-d 00:00:00');

        $dql = "SELECT 
                  a.id, 
                  a.projectId, p.projectName, 
                  a.campaignId, c.campaignName, 
                  a.spotId, s.spotName,
                  a.versionId, v.versionName, 
                  a.activityTypeId, ac.name AS activityValue, a.activityDescription,
                  a.startDate, a.duration, 
                  a.notes, a.status, st.status as statusName
                FROM \Application\Entity\RediTimeEntry a 
                LEFT JOIN \Application\Entity\RediSpot s
                  WITH a.spotId=s.id
                LEFT JOIN \Application\Entity\RediProject p
                  WITH p.id=a.projectId
                LEFT JOIN \Application\Entity\RediCampaign c
                  WITH c.id=a.campaignId
                LEFT JOIN \Application\Entity\RediVersion v
                  WITH v.id=a.versionId
                LEFT JOIN \Application\Entity\RediActivity ac
                  WITH ac.id=a.activityTypeId    
                LEFT JOIN \Application\Entity\RediStatus st
                  WITH a.status=st.id
                WHERE 
                  a.userId=:user_id
                AND a.startDate>=:start_date
                AND a.startDate<=:end_date
                ORDER BY a.id ASC";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('user_id', $userId);
        $query->setParameter('start_date', $startDate);
        $query->setParameter('end_date', $endDate);
        $result = $query->getArrayResult();

        foreach($result as &$row) {
            $row['startDate'] = $row['startDate']->format('Y-m-d H:i:s');
        }
        return $result;
    }

    public function getById($id)
    {
        $dql = "SELECT 
                a.id, a.userId,
                  a.projectId, p.projectName, 
                  a.campaignId, c.campaignName, 
                  a.spotId, s.spotName,
                  a.versionId, v.versionName, 
                  a.activityTypeId, ac.value AS activityValue,a.activityDescription,
                  ac.label AS activityLabel,
                  a.startDate, a.duration, 
                  a.notes, a.status, st.status as statusName
                FROM \Application\Entity\RediTimeEntry a 
                LEFT JOIN \Application\Entity\RediSpot s
                  WITH a.spotId=s.id
                LEFT JOIN \Application\Entity\RediProject p
                  WITH p.id=a.projectId
                LEFT JOIN \Application\Entity\RediCampaign c
                  WITH c.id=a.campaignId
                LEFT JOIN \Application\Entity\RediVersion v
                  WITH v.id=a.versionId
                LEFT JOIN \Application\Entity\RediActivity ac
                  WITH ac.id=a.activityTypeId
                LEFT JOIN \Application\Entity\RediStatus st
                  WITH a.status=st.id
                WHERE a.id=:id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('id', $id);
        $query->setMaxResults(1);
        $result =  $query->getArrayResult();

        $response =  (isset($result[0])?$result[0]:null);

        if($response) {
            if($response['startDate']) {
                $response['startDate'] = $response['startDate']->format('Y-m-d H:i:s');
            }

        }

        return $response;
    }

    public function getUserTimeEntryOfADate($userId, $date)
    {
        $date = new \DateTime($date);

        $dql = "SELECT
                  a
                FROM \Application\Entity\RediTimeEntry a 
                WHERE 
                  a.userId=:user_id 
                  AND a.startDate>=:date_start
                  AND a.startDate<=:date_end ";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('user_id', $userId);
//        $query->setParameter('date', $date);
        $query->setParameter('date_start', $date->format('Y-m-d 00:00:00'));
        $query->setParameter('date_end',   $date->format('Y-m-d 23:59:59'));
        $result =  $query->getArrayResult();

        return $result;
    }
}
