<?php
namespace Application\Entity\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManager;

// before called Table now Repository Table Data Gateway
// In Bug Entity add  @Entity(repositoryClass="BugRepository")
// To be able to use this query logic through
// $this->getEntityManager()->getRepository('Bug') we have to adjust the metadata slightly.
// http://stackoverflow.com/questions/10481916/the-method-name-must-start-with-either-findby-or-findoneby-uncaught-exception

class PermissionRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediNavigationPermission";

    public function __construct(EntityManager $entityManager)
    {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);
    }


    public function getPermission($userId)
    {
        $dql = "SELECT 
                  n
                FROM
                  \Application\Entity\RediNavigationPermission np 
                  INNER JOIN \Application\Entity\RediNavigation n 
                    WITH np.navigationId = n.id 
                WHERE np.userId = :user_id
                ORDER BY n.parent,
                  n.serial,
                  n.id ";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('user_id', $userId);

        $result = $query->getArrayResult();

//       var_dump($result);

        $response = array();

        foreach($result as $row) {
            if((int)$row['parent']==0) {
                $response[$row['id']] = array(
                    'id' => $row['id'],
                    'name' => $row['name']
                );
            } else if((int)$row['parent']>0) {
                $response[$row['parent']]['links'][] = array(
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'route' => $row['route']
                );
            }
        }

//        var_dump($response); exit;
        return array_values($response);
    }

}
