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

class VersionRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediVersion";

    public function __construct(EntityManager $entityManager) {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);
    }

    public function search($search = '', $offset = 0, $length = 10)
    {
        $dql = "SELECT a 
                FROM \Application\Entity\RediVersion a ";


        if ($search) {
            $dql .= " WHERE (a.versionName LIKE '%" . $search . "%' )";
        }

        $dql .= " ORDER BY a.id ASC";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setFirstResult($offset);
        $query->setMaxResults($length);
        return $query->getArrayResult();
    }

    public function searchCount($search = '')
    {
        $dql = "SELECT COUNT(a.id) AS total_count 
                FROM \Application\Entity\RediVersion a ";


        if ($search) {
            $dql .= " WHERE (a.versionName LIKE '%" . $search . "%' )";
        }

        $query = $this->getEntityManager()->createQuery($dql);
        $result =  $query->getArrayResult();

        return (isset($result[0]['total_count'])?(int)$result[0]['total_count']:0);
    }

    public function searchWithSpot($search = '', $spotId, $offset = 0, $length = 10)
    {
        $dql = "SELECT a.id, a.versionName, sv.spotId, sv.billingType
                FROM \Application\Entity\RediVersion a
                INNER JOIN \Application\Entity\RediSpotVersion sv 
                  WITH a.id=sv.versionId
                 WHERE sv.spotId=:spot_id";


        if ($search) {
            $dql .= " AND (a.versionName LIKE '%" . $search . "%' )";
        }

        $dql .= " ORDER BY a.id ASC";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('spot_id', $spotId);
        $query->setFirstResult($offset);
        $query->setMaxResults($length);
        return $query->getArrayResult();
    }

    public function searchCountWithSpot($search = '', $spotId)
    {
        $dql = "SELECT COUNT(a.id) AS total_count 
                FROM \Application\Entity\RediVersion a 
                 INNER JOIN \Application\Entity\RediSpotVersion sv 
                  WITH a.id=sv.versionId
                 WHERE sv.spotId=:spot_id";


        if ($search) {
            $dql .= " AND (a.versionName LIKE '%" . $search . "%' )";
        }

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('spot_id', $spotId);
        $result =  $query->getArrayResult();

        return (isset($result[0]['total_count'])?(int)$result[0]['total_count']:0);
    }
}
