<?php
namespace Application\Entity\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManager;
use Zend\Config\Config;
use Zend\I18n\Validator\DateTime;

// before called Table now Repository Table Data Gateway
// In Bug Entity add  @Entity(repositoryClass="BugRepository")
// To be able to use this query logic through
// $this->getEntityManager()->getRepository('Bug') we have to adjust the metadata slightly.
// http://stackoverflow.com/questions/10481916/the-method-name-must-start-with-either-findby-or-findoneby-uncaught-exception

class CommentRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediComment";

    public function __construct(EntityManager $entityManager)
    {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);
    }

    public function search($offset = 0, $length = 10, $fromOldest = 0, $filter=array(), $userImagesBaseUrl)
    {
        $dql = "SELECT
                  c.id, c.comment, c.userId, c.parentId, c.typeId, c.commentRead, c.createdAt,
                  ct.commentType, u.firstName, u.lastName, u.image
                FROM \Application\Entity\RediComment c
                LEFT JOIN \Application\Entity\RediCommentType ct
                  WITH ct.id=c.typeId
                LEFT JOIN \Application\Entity\RediUser u
                  WITH u.id=c.userId";

        $dqlFilter = [];

        if (isset($filter['user_id']) && $filter['user_id']) {
            $dqlFilter[] = " c.userId=:user_id ";
        }

        if (isset($filter['parent_id']) && $filter['parent_id']) {
            $dqlFilter[] = " c.parentId=:parent_id ";
        }

        if (isset($filter['type_id']) && $filter['type_id']) {
            $dqlFilter[] = " c.typeId=:type_id ";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " .  implode(" AND ", $dqlFilter);
        }

        if ($fromOldest === 0) {
            $dql .= " ORDER BY c.createdAt DESC";
        } else {
            $dql .= " ORDER BY c.createdAt ASC";
        }

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setFirstResult($offset);
        $query->setMaxResults($length);

        if (isset($filter['user_id']) && $filter['user_id']) {
            $query->setParameter('user_id', $filter['user_id']);
        }

        if (isset($filter['parent_id']) && $filter['parent_id']) {
            $query->setParameter('parent_id', $filter['parent_id']);
        }

        if (isset($filter['type_id']) && $filter['type_id']) {
            $query->setParameter('type_id', $filter['type_id']);
        }

        if (isset($filter['work_type_id']) && $filter['work_type_id']) {
            $query->setParameter('work_type_id', $filter['work_type_id']);
        }

        $data = $query->getArrayResult();
        $response = array();

        foreach($data as $row) {
            $tempRow = array(
                'id' => $row['id'],
                'comment' => $row['comment'],
                'user' => array(
                    'id' => $row['userId'],
                    'firstName' => $row['firstName'],
                    'lastName' => $row['lastName'],
                    'fullName' => trim($row['firstName'] . ' ' . $row['lastName']),
                    'image' => $userImagesBaseUrl . $row['image']
                ),
                'parentId' => $row['parentId'],
                'typeId' => $row['typeId'],
                'commentType' => $row['commentType'],
                'read' => (int)$row['commentRead'],
                'createdAt' => ($row['createdAt']?$row['createdAt']->format('Y-m-d H:i:s'): null)
            );

            $response[] = $tempRow;
        }

        return $response;
    }

    public function searchCount($filter=array())
    {
        $dql = "SELECT
                  COUNT(c.id) AS total_count
                FROM \Application\Entity\RediComment c ";

        $dqlFilter = [];

        if (isset($filter['user_id']) && $filter['user_id']) {
            $dqlFilter[] = " c.userId=:user_id ";
        }

        if (isset($filter['parent_id']) && $filter['parent_id']) {
            $dqlFilter[] = " c.parentId=:parent_id ";
        }

        if (isset($filter['type_id']) && $filter['type_id']) {
            $dqlFilter[] = " c.typeId=:type_id ";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " .  implode(" AND ", $dqlFilter);
        }

        $query = $this->getEntityManager()->createQuery($dql);

        if (isset($filter['user_id']) && $filter['user_id']) {
            $query->setParameter('user_id', $filter['user_id']);
        }

        if (isset($filter['parent_id']) && $filter['parent_id']) {
            $query->setParameter('parent_id', $filter['parent_id']);
        }

        if (isset($filter['type_id']) && $filter['type_id']) {
            $query->setParameter('type_id', $filter['type_id']);
        }

        if (isset($filter['work_type_id']) && $filter['work_type_id']) {
            $query->setParameter('work_type_id', $filter['work_type_id']);
        }

        $result = $query->getArrayResult();

        return (isset($result[0]['total_count'])?(int)$result[0]['total_count']:0);
    }

    public function getById($id, $userImagesBaseUrl)
    {
        $dql = "SELECT
                  c.id, c.comment, c.userId, c.parentId, c.typeId, c.commentRead, c.createdAt,
                  ct.commentType, u.firstName, u.lastName, u.image
                FROM \Application\Entity\RediComment c
                LEFT JOIN \Application\Entity\RediCommentType ct
                  WITH ct.id=c.typeId
                LEFT JOIN \Application\Entity\RediUser u
                  WITH u.id=c.userId
                WHERE c.id=:id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('id', $id);
        $query->setMaxResults(1);
        $result = $query->getArrayResult();
        $row = (isset($result[0]) ? $result[0] : null);

        if($row) {
            $response = array(
                'id' => $row['id'],
                'comment' => $row['comment'],
                'user' => array(
                    'id' => $row['userId'],
                    'firstName' => $row['firstName'],
                    'lastName' => $row['lastName'],
                    'fullName' => trim($row['firstName'] . ' ' . $row['lastName']),
                    'image' => $userImagesBaseUrl . $row['image']
                ),
                'parentId' => $row['parentId'],
                'typeId' => $row['typeId'],
                'commentType' => $row['commentType'],
                'read' => (int)$row['commentRead'],
                'createdAt' => ($row['createdAt']?$row['createdAt']->format('Y-m-d H:i:s'): null)
            );
        } else {
            $response = null;
        }

        return $response;
    }

    public function getEstimateWorker($id)
    {
        $dql = "SELECT a
                FROM \Application\Entity\RediEstimateToWorker a
                WHERE a.estimateId=:id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('id', $id);
//        $query->setMaxResults(1);
        $result = $query->getArrayResult();


        return $result;
    }

    public function getSubmittedTo($id)
    {
        $dql = "SELECT
                  a.id, a.firstName, a.lastName
                FROM \Application\Entity\RediUser a
                WHERE a.id=:id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('id', $id);
        $query->setMaxResults(1);
        $result = $query->getArrayResult();


        if(isset($result[0])) {
            $response = $result[0];
            $response['fullName'] = trim($response['firstName'] . ' ' . $response['lastName']);
        } else {
            $response = null;
        }

        return $response;
    }
}
