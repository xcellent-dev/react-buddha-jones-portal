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

class UsersRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediUser";

    public function __construct(EntityManager $entityManager) {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);
    }

    public function getRolesArray($number = 30)
    {
        $dql = "SELECT u FROM \Application\Entity\RediUser u";
        $query = $this->getEntityManager()->createQuery($dql);
//        $query->setMaxResults($number);
        return $query->getArrayResult();
//        return array('foo' => 'bar');
    }
    public function search($search='', $typeId=[], $offset = 0, $length = 10)
    {
        $dql = "SELECT a.id, a.username, a.firstName as first_name, a.lastName as last_name,
                CONCAT(a.firstName, ' ', a.lastName) as full_name, a.image, a.email,
                a.initials, a.typeId as type_id, ut.typeName as type_name,
                a.hourlyRate as hourly_rate, a.salaryType as salary_type,
                a.salaryAmount as salary_amount, a.minHour as min_hour,
                a.status
                FROM \Application\Entity\RediUser a 
                LEFT JOIN \Application\Entity\RediUserType ut 
                    WITH a.typeId=ut.id ";

        $dqlFilter = [];

        if ($search) {
            $dqlFilter[] = " (a.firstName LIKE '%" . $search . "%' OR a.lastName LIKE '%" . $search . "%' OR a.username LIKE '%" . $search . "%' OR a.initials ='" . $search . "') ";
        }

        if (count($typeId)) {
                $dqlFilter[] = " a.typeId IN (" . implode(',', $typeId) . ") ";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " .  implode(" AND ", $dqlFilter);
        }

        $dql .= " ORDER BY a.id ASC";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setFirstResult($offset);
        $query->setMaxResults($length);
//        echo $query->getSQL(); exit;
        $data = $query->getArrayResult();

        foreach($data as &$row) {
            $row['full_name'] = trim(implode(' ', array($row['first_name'], $row['last_name'])));
        }

        return $data;
    }

    public function getUser($userId)
    {
        $dql = "SELECT a.id, a.username, a.firstName as first_name, a.lastName as last_name,
                CONCAT(a.firstName, ' ', a.lastName) as full_name, a.image, a.email,
                a.initials, a.typeId as type_id, ut.typeName as type_name,
                a.hourlyRate as hourly_rate, a.salaryType as salary_type,
                a.salaryAmount as salary_amount, a.minHour as min_hour,
                a.status
                FROM \Application\Entity\RediUser a 
                JOIN \Application\Entity\RediUserType ut 
                    WITH a.typeId=ut.id 
                WHERE a.id=:user_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('user_id', $userId);
        $query->setMaxResults(1);
//        echo $query->getSQL(); exit;
        $user =  $query->getArrayResult();

        if(isset($user[0])) {
            $response = $user[0];

            $response['full_name'] = trim(implode(' ', array($response['first_name'], $response['last_name'])));
        } else {
            $response = null;
        }

        return $response;
    }

    public function searchCount($search='', $typeId=0)
    {
        $dql = "SELECT COUNT(a.id) AS total_count
                FROM \Application\Entity\RediUser a 
                LEFT JOIN \Application\Entity\RediUserType ut 
                    WITH a.typeId=ut.id ";

        $dqlFilter = [];

        if ($search) {
            $dqlFilter[] = " (a.firstName LIKE '%" . $search . "%' OR a.lastName LIKE '%" . $search . "%' OR a.username LIKE '%" . $search . "%' OR a.initials ='" . $search . "') ";
        }

        if (count($typeId)) {
            $dqlFilter[] = " a.typeId IN (" . implode(',', $typeId) . ") ";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " .  implode(" AND ", $dqlFilter);
        }

        $query = $this->getEntityManager()->createQuery($dql);

        $result = $query->getArrayResult();

        return (int)$result[0]['total_count'];
    }

}
