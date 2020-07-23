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

class ActivityRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediActivity";

    public function __construct(EntityManager $entityManager)
    {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);
    }

    public function search($filter)
    {
        $dql = "SELECT DISTINCT a.id, a.name, a.typeId, at.activityType, a.userTypeId, a.status 
                FROM \Application\Entity\RediActivity a 
                LEFT JOIN \Application\Entity\RediActivityType at
                  WITH at.id=a.typeId ";


        $dqlFilter = [];

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (a.name LIKE :search) ";
        }

        if (isset($filter['type_id']) && count($filter['type_id'])) {
            $dqlFilter[] = " (a.typeId IN (" . implode(',', $filter['type_id']) . ")) ";
        }

        if (isset($filter['user_type_id']) && $filter['user_type_id']) {
            $dqlFilter[] = " (a.userTypeId =:user_type_id OR a.userTypeId IS NULL) ";
        }

        if (count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $dql .= "ORDER BY a.name ASC, at.activityType ASC";

        $query = $this->getEntityManager()->createQuery($dql);

        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }

        if (isset($filter['user_type_id']) && $filter['user_type_id']) {
            $query->setParameter('user_type_id', $filter['user_type_id']);
        }


        $data = $query->getArrayResult();

        return $data;
    }

    public function searchWithPrice($filter)
    {
        $dql = "SELECT DISTINCT a.id, a.name, a.typeId, at.activityType, a.userTypeId, a.status, cp.price
                FROM \Application\Entity\RediActivity a 
                LEFT JOIN \Application\Entity\RediActivityType at
                  WITH at.id=a.typeId
                LEFT JOIN \Application\Entity\RediCustomerPrice cp
                  WITH cp.activityId=a.id AND cp.customerId=:customer_id ";


        $dqlFilter = [];

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (a.name LIKE :search) ";
        }

        if (isset($filter['type_id']) && count($filter['type_id'])) {
            $dqlFilter[] = " (a.typeId IN (" . implode(',', $filter['type_id']) . ")) ";
        }

        if (isset($filter['user_type_id']) && $filter['user_type_id']) {
            $dqlFilter[] = " (a.userTypeId =:user_type_id OR a.userTypeId IS NULL) ";
        }

        if (count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $dql .= "ORDER BY a.name ASC, at.activityType ASC";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('customer_id', $filter['customer_id']);

        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }


        if (isset($filter['user_type_id']) && $filter['user_type_id']) {
            $query->setParameter('user_type_id', $filter['user_type_id']);
        }

        $data = $query->getArrayResult();

        return $data;
    }

    public function searchCount($filter)
    {
        $dql = "SELECT COUNT(DISTINCT a.id) AS total_count
                FROM \Application\Entity\RediActivity a 
                LEFT JOIN \Application\Entity\RediActivityType at
                  WITH at.id=a.typeId ";

        $dqlFilter = [];

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (a.name LIKE :search) ";
        }

        if (isset($filter['type_id']) && count($filter['type_id'])) {
            $dqlFilter[] = " (a.typeId IN (" . implode(',', $filter['type_id']) . ")) ";
        }

        if (count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $query = $this->getEntityManager()->createQuery($dql);

        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }


        $result = $query->getArrayResult();

        return (isset($result[0]['total_count']) ? (int)$result[0]['total_count'] : 0);
    }

    public function getAllActivityType()
    {
        $dql = "SELECT a 
                FROM \Application\Entity\RediActivityType a 
                ORDER BY a.id ASC";

        $query = $this->getEntityManager()->createQuery($dql);

        return $query->getArrayResult();
    }
}
