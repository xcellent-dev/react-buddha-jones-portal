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

class CustomerRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediCustomer";

    public function __construct(EntityManager $entityManager)
    {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);
    }

    public function search($offset = 0, $length = 10, $filter=array())
    {
        $dql = "SELECT  
                  cu
                FROM \Application\Entity\RediCustomer cu ";

        $dqlFilter = [];


        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (cu.customerName LIKE :search) ";
        }

        if (isset($filter['first_letter']) && $filter['first_letter']) {
            if(strtolower($filter['first_letter']=='other')) {
                $dqlFilter[] = " (SUBSTRING(cu.customerName, 1,1)<'A' AND SUBSTRING(cu.customerName, 1,1)<'0') ";
            } elseif($filter['first_letter']=='0-9') {
                $dqlFilter[] = " (SUBSTRING(cu.customerName, 1,1)>0 OR SUBSTRING(cu.customerName, 1,1)='0') ";
            } else {
                $dqlFilter[] = " (UPPER(SUBSTRING(cu.customerName, 1, 1))=:first_letter) ";
            }
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " .  implode(" AND ", $dqlFilter);
        }

        $dql .= " ORDER BY cu.customerName ASC";

        
        $query = $this->getEntityManager()->createQuery($dql);
        $query->setFirstResult($offset);
        $query->setMaxResults($length);

        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }

        if (isset($filter['first_letter']) && $filter['first_letter']) {
            if($filter['first_letter']!='0-9' && strtolower($filter['first_letter']!='other')) {
                $query->setParameter('first_letter', $filter['first_letter']);
            }
        }

        $data = $query->getArrayResult();


//        foreach($data as &$row) {
//            $row['totalAmount'] = (float)$row['totalAmount'];
//            $row['createdAt'] = $row['createdAt']->format('Y-m-d H:i:s');
//
//            unset($row['statusOrderFilter']);
//        }

        return $data;
    }

    public function searchCount($filter=array())
    {
        $dql = "SELECT 
                  COUNT(cu.id) AS total_count 
                FROM \Application\Entity\RediCustomer cu ";

        $dqlFilter = [];

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (cu.customerName LIKE :search ) ";
        }

        if (isset($filter['first_letter']) && $filter['first_letter']) {
            if(strtolower($filter['first_letter']=='other')) {
                $dqlFilter[] = " (SUBSTRING(cu.customerName, 1,1)<'A' AND SUBSTRING(cu.customerName, 1,1)<'0') ";
            } elseif($filter['first_letter']=='0-9') {
                $dqlFilter[] = " (SUBSTRING(cu.customerName, 1,1)>0 OR SUBSTRING(cu.customerName, 1,1)='0') ";
            } else {
                $dqlFilter[] = " (UPPER(SUBSTRING(cu.customerName, 1, 1))=:first_letter) ";
            }
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " .  implode(" AND ", $dqlFilter);
        }

        $query = $this->getEntityManager()->createQuery($dql);

        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }

        if (isset($filter['first_letter']) && $filter['first_letter']) {
            if($filter['first_letter']!='0-9' && strtolower($filter['first_letter']!='other')) {
                $query->setParameter('first_letter', $filter['first_letter']);
            }
        }
        $result =  $query->getArrayResult();

        return (isset($result[0]['total_count'])?(int)$result[0]['total_count']:0);
    }

    public function getById($id)
    {
        $dql = "SELECT 
                  cu
                FROM \Application\Entity\RediCustomer cu
                WHERE cu.id=:id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('id', $id);
        $query->setMaxResults(1);
        $result = $query->getArrayResult();

        $response = (isset($result[0]) ? $result[0] : null);

        if($response) {
            $contactDql = "SELECT 
                  cc
                FROM \Application\Entity\RediCustomerContact cc
                WHERE cc.customerId=:id";

            $contactQuery = $this->getEntityManager()->createQuery($contactDql);
            $contactQuery->setParameter('id', $id);
            $response['contact'] = $contactQuery->getArrayResult();
        }

        return $response;
    }

    public function getDistinctCustomerFirstLetter()
    {
        $dql = "SELECT DISTINCT 
                  cfl 
                FROM
                  (SELECT 
                    CASE
                      WHEN UPPER(SUBSTRING(customer_name, 1, 1)) REGEXP '[0-9]' 
                      THEN '0-9' 
                      WHEN UPPER(SUBSTRING(customer_name, 1, 1)) NOT REGEXP '[0-9A-Za-z]' 
                      THEN 'Other' 
                      ELSE UPPER(SUBSTRING(customer_name, 1, 1)) 
                    END AS cfl 
                  FROM
                    redi_customer) AS a 
                ORDER BY 
                  CASE
                      WHEN cfl='Other' 
                      THEN 'zzz' 
                      ELSE cfl 
                    END";

        $query = $this->getEntityManager()->getConnection()->prepare($dql);
        $query->execute();

        $data = $query->fetchAll();

        $response = array();

        foreach($data as $row) {
            $response[] = $row['cfl'];
        }

        return $response;
    }

    public function searchCustomerContact($filter=array())
    {
        $dql = "SELECT  
                  cc
                FROM \Application\Entity\RediCustomerContact cc ";

        $dqlFilter = [];

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (cc.name LIKE :search OR cc.email LIKE :search) ";
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $dqlFilter[] = " cc.customerId=:customer_id ";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " .  implode(" AND ", $dqlFilter);
        }

        $dql .= " ORDER BY cc.name ASC";

        $query = $this->getEntityManager()->createQuery($dql);

        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $query->setParameter('customer_id',  $filter['customer_id']);
        }

        $data = $query->getArrayResult();

        foreach($data as &$row) {
            $row['projectCampaign'] = $this->getProjectCampaignOfCustomerContact($row['id']);
        }

        return $data;
    }

    public function getProjectCampaignOfCustomerContact($customerContactId)
    {
        $dql = "SELECT  
                  ptc.projectId, p.projectName, ptc.campaignId, c.campaignName
                FROM \Application\Entity\RediCustomerContactToProjectCampaign cctpc 
                INNER JOIN \Application\Entity\RediProjectToCampaign ptc 
                  WITH cctpc.projectToCampaignId=ptc.id 
                INNER JOIN \Application\Entity\RediProject p 
                  WITH p.id=ptc.projectId 
                INNER JOIN \Application\Entity\RediCampaign c 
                  WITH c.id=ptc.campaignId
                WHERE 
                  cctpc.customerContactId=:customer_contact_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('customer_contact_id',  $customerContactId);

        $data = $query->getArrayResult();

        return $data;
    }


}
