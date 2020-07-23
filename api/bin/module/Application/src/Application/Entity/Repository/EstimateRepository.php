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

class EstimateRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediEstimate";

    public function __construct(EntityManager $entityManager)
    {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);
    }

    public function search($offset = 0, $length = 10, $filter = array())
    {
        $dql = "SELECT  
                  a.id, 
                  a.spotId, s.spotName, 
                  s.projectId, p.projectName,
                  p.customerId, cu.customerName,
                  s.campaignId, c.campaignName,
                  a.versionId, v.versionName, 
                  a.statusId, st.status,
                  a.timeUnit,
                  a.multiplier,
                  a.totalAmount,
                  a.createdAt,
                  a.updatedAt,
                  CASE
                    WHEN a.statusId = 1 THEN  0 
                    ELSE 1 
                  END  statusOrderFilter
                FROM \Application\Entity\RediEstimate a 
                LEFT JOIN \Application\Entity\RediSpot s
                  WITH a.spotId=s.id 
                LEFT JOIN \Application\Entity\RediVersion v
                  WITH a.versionId=v.id 
                LEFT JOIN \Application\Entity\RediStatus st 
                  WITH a.statusId=st.id 
                LEFT JOIN \Application\Entity\RediProject p
                  WITH p.id=s.projectId
                LEFT JOIN \Application\Entity\RediCampaign c
                  WITH c.id=s.campaignId 
                LEFT JOIN \Application\Entity\RediCustomer cu
                  WITH cu.id=p.customerId ";

        $dqlFilter = [];

        if (isset($filter['spot_id']) && $filter['spot_id']) {
            $dqlFilter[] = " a.spotId=:spot_id ";
        }

        if (isset($filter['project_id']) && $filter['project_id']) {
            $dqlFilter[] = " s.projectId=:project_id ";
        }

        if (isset($filter['campaign_id']) && $filter['campaign_id']) {
            $dqlFilter[] = " a.campaignId=:campaign_id ";
        }

        if (isset($filter['status_id']) && $filter['status_id']) {
            $dqlFilter[] = " a.statusId=:status_id ";
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $dqlFilter[] = " p.customerId=:customer_id ";
        }

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (s.spotName LIKE :search OR p.projectName  LIKE :search OR  c.campaignName LIKE :search OR v.versionName  LIKE :search ) ";
        }

        if (count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

//        $dql .= " ORDER BY a.id ASC";

        if (isset($filter['sort']) && strtolower($filter['sort']) == 'priority') {
            $dql .= " ORDER BY statusOrderFilter ASC, a.updatedAt DESC, a.createdAt ASC ";
        } else {
            $dql .= " ORDER BY a.createdAt ASC ";
        }

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setFirstResult($offset);
        $query->setMaxResults($length);

        if (isset($filter['spot_id']) && $filter['spot_id']) {
            $query->setParameter('spot_id', $filter['spot_id']);
        }

        if (isset($filter['project_id']) && $filter['project_id']) {
            $query->setParameter('project_id', $filter['project_id']);
        }

        if (isset($filter['campaign_id']) && $filter['campaign_id']) {
            $query->setParameter('campaign_id', $filter['campaign_id']);
        }

        if (isset($filter['status_id']) && $filter['status_id']) {
            $query->setParameter('status_id', $filter['status_id']);
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $query->setParameter('customer_id', $filter['customer_id']);
        }

        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }

        $data = $query->getArrayResult();

        foreach ($data as &$row) {
            $row['totalAmount'] = (float)$row['totalAmount'];
            $row['createdAt'] = $row['createdAt']->format('Y-m-d H:i:s');

            if ($row['updatedAt']) {
                $row['updatedAt'] = $row['updatedAt']->format('Y-m-d H:i:s');
            }

            unset($row['statusOrderFilter']);
        }

        return $data;
    }

    public function searchCount($filter = array())
    {
        $dql = "SELECT 
                  COUNT(a.id) AS total_count 
                FROM \Application\Entity\RediEstimate a 
                LEFT JOIN \Application\Entity\RediSpot s
                  WITH a.spotId=s.id 
                LEFT JOIN \Application\Entity\RediVersion v
                  WITH a.versionId=v.id 
                LEFT JOIN \Application\Entity\RediStatus st 
                  WITH a.statusId=st.id 
                LEFT JOIN \Application\Entity\RediProject p
                  WITH p.id=s.projectId 
                LEFT JOIN \Application\Entity\RediCampaign c
                  WITH c.id=s.campaignId ";

        $dqlFilter = [];

        if (isset($filter['spot_id']) && $filter['spot_id']) {
            $dqlFilter[] = " a.spotId=:spot_id ";
        }

        if (isset($filter['project_id']) && $filter['project_id']) {
            $dqlFilter[] = " s.projectId=:project_id ";
        }

        if (isset($filter['campaign_id']) && $filter['campaign_id']) {
            $dqlFilter[] = " a.campaignId=:campaign_id ";
        }

        if (isset($filter['status_id']) && $filter['status_id']) {
            $dqlFilter[] = " a.statusId=:status_id ";
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $dqlFilter[] = " p.customerId=:customer_id ";
        }

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (s.spotName LIKE :search OR p.projectName  LIKE :search OR  c.campaignName LIKE :search OR v.versionName  LIKE :search ) ";
        }

        if (count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $query = $this->getEntityManager()->createQuery($dql);

        if (isset($filter['spot_id']) && $filter['spot_id']) {
            $query->setParameter('spot_id', $filter['spot_id']);
        }

        if (isset($filter['project_id']) && $filter['project_id']) {
            $query->setParameter('project_id', $filter['project_id']);
        }

        if (isset($filter['campaign_id']) && $filter['campaign_id']) {
            $query->setParameter('campaign_id', $filter['campaign_id']);
        }

        if (isset($filter['status_id']) && $filter['status_id']) {
            $query->setParameter('status_id', $filter['status_id']);
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $query->setParameter('customer_id', $filter['customer_id']);
        }


        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }
        $result = $query->getArrayResult();

        return (isset($result[0]['total_count']) ? (int)$result[0]['total_count'] : 0);
    }

    public function getById($id)
    {
        $dql = "SELECT 
                  a.id, 
                  a.spotId, s.spotName, 
                  s.projectId, p.projectName,
                  p.customerId, cu.customerName,
                  s.campaignId, c.campaignName,
                  a.versionId, v.versionName, 
                  a.statusId, st.status,
                  a.multiplier, a.notes, a.submittedTo,
                  a.timeUnit,
                  a.totalAmount,
                  a.createdAt
                FROM \Application\Entity\RediEstimate a 
                LEFT JOIN \Application\Entity\RediSpot s
                  WITH a.spotId=s.id 
                LEFT JOIN \Application\Entity\RediVersion v
                  WITH a.versionId=v.id 
                LEFT JOIN \Application\Entity\RediStatus st 
                  WITH a.statusId=st.id 
                LEFT JOIN \Application\Entity\RediProject p
                  WITH p.id=s.projectId
                LEFT JOIN \Application\Entity\RediCampaign c
                  WITH c.id=s.campaignId 
                LEFT JOIN \Application\Entity\RediCustomer cu
                  WITH cu.id=p.customerId
                WHERE a.id=:id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('id', $id);
        $query->setMaxResults(1);
        $result = $query->getArrayResult();

        $response = (isset($result[0]) ? $result[0] : null);

        if ($response) {
            $response['id'] = (int)$response['id'];
            $response['totalAmount'] = (float)$response['totalAmount'];
            $response['createdAt'] = $response['createdAt']->format('Y-m-d H:i:s');
        }

        return $response;
    }

    public function getEstimateWorker($id)
    {
        $dql = "SELECT 
                    a.estimateId, 
                    a.workerId, u.firstName, u.lastName, '' as fullName,
                    a.hourlyRate,
                    a.estimatedRegular, a.estimatedOvertime, a.estimatedDoubletime,
                    a.totalAmount
                FROM \Application\Entity\RediEstimateToWorker a 
                INNER JOIN \Application\Entity\RediUser u
                  WITH u.id=a.workerId
                WHERE a.estimateId=:id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('id', $id);

        $data = $query->getArrayResult();

        foreach ($data as &$row) {
            $row['estimateId'] = (int)$row['estimateId'];
            $row['workerId'] = (int)$row['workerId'];
            $row['fullName'] = trim($row['firstName'] . ' ' . $row['lastName']);
            $row['hourlyRate'] = (float)$row['hourlyRate'];
            $row['estimatedRegular'] = (float)$row['estimatedRegular'];
            $row['estimatedOvertime'] = (float)$row['estimatedOvertime'];
            $row['estimatedDoubletime'] = (float)$row['estimatedDoubletime'];
            $row['totalAmount'] = (float)$row['totalAmount'];
        }

        return $data;
    }

    public function getEstimateTemporaryStaff($id)
    {
        $dql = "SELECT 
                    a.id, a.estimateId, a.name, a.estimatedTime, a.rate, a.totalAmount
                FROM \Application\Entity\RediEstimateTemporaryStaff a
                WHERE a.estimateId=:id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('id', $id);

        $data = $query->getArrayResult();

        foreach ($data as &$row) {
            $row['id'] = (int)$row['id'];
            $row['estimateId'] = (int)$row['estimateId'];
            $row['rate'] = (float)$row['rate'];
            $row['estimatedTime'] = (float)$row['estimatedTime'];
            $row['totalAmount'] = (float)$row['totalAmount'];
        }

        return $data;
    }

    public function getEstimateOutsideCost($id)
    {
        $dql = "SELECT 
                    a.id, a.estimateId, 
                    a.outsideCostId, oc.name AS outsideCost,
                    a.typeId, oct.name AS outsideCostType,
                    a.cost
                FROM \Application\Entity\RediEstimateToOutsideCost a
                INNER JOIN \Application\Entity\RediOutsideCost oc 
                  WITH oc.id=a.outsideCostId
                INNER JOIN \Application\Entity\RediEstimateOutsideCostType oct
                  WITH oct.id=a.typeId                
                WHERE a.estimateId=:id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('id', $id);

        $data = $query->getArrayResult();

        foreach ($data as &$row) {
            $row['id'] = (int)$row['id'];
            $row['estimateId'] = (int)$row['estimateId'];
            $row['outsideCostId'] = (int)$row['outsideCostId'];
            $row['typeId'] = (int)$row['typeId'];
            $row['cost'] = (float)$row['cost'];
        }

        return $data;
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


        if (isset($result[0])) {
            $response = $result[0];
            $response['fullName'] = trim($response['firstName'] . ' ' . $response['lastName']);
        } else {
            $response = null;
        }

        return $response;
    }

    public function getEstimateTotal($estimateId)
    {
        $dql = "SELECT 
                    SUM(etw.totalAmount) AS total
                FROM \Application\Entity\RediEstimateToWorker etw
                  WHERE etw.estimateId=:estimate_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('estimate_id', $estimateId);
        $query->setMaxResults(1);
        $result = $query->getArrayResult();

        return (isset($result[0]['total']) ? $result[0]['total'] : 0);
    }

    public function getHistoryByEstimateId($estimateId, $imagePath)
    {
        $dql = "SELECT
                  ph.id, ph.message, ph.userId, u.username, u.firstName, u.lastName, '' AS fullName,
                  u.image, ph.createdAt
                FROM \Application\Entity\RediEstimateHistory ph
                INNER JOIN \Application\Entity\RediUser u
                  WITH ph.userId=u.id
                WHERE
                  ph.estimateId=:estimate_id
                ORDER BY ph.createdAt DESC";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('estimate_id', $estimateId);
        $data = $query->getArrayResult();

        foreach ($data as &$row) {
            $row['fullName'] = trim($row['firstName'] . ' ' . $row['lastName']);

            if ($row['image']) {
                $row['image'] = $imagePath . $row['image'];
            } else {
                $row['image'] = null;
            }

            $row['createdAt'] = $row['createdAt']->format('Y-m-d H:i:s');
        }

        return $data;
    }

    public function searchEstimateType($filter = array())
    {
        $dql = "SELECT
                  et
                FROM \Application\Entity\RediEstimateType et ";

        $dqlFilter = [];

        if (isset($filter['active']) && $filter['active']) {
            $dqlFilter[] = " et.active=:active ";
        }

        if (count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $dql .= " ORDER BY et.name ASC";

        $query = $this->getEntityManager()->createQuery($dql);

        if (isset($filter['active']) && $filter['active']) {
            $query->setParameter('active', $filter['active']);
        }

        $result = $query->getArrayResult();

        return $result;
    }

    public function searchEstimateTemporaryStaff($filter = array(), $length)
    {
        $dql = "SELECT
                  DISTINCT ets.name
                FROM \Application\Entity\RediEstimateTemporaryStaff ets ";

        $dqlFilter = [];

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (ets.name LIKE :search) ";
        }

        if (count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $dql .= " ORDER BY ets.name ASC";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setMaxResults($length);

        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }

        $data = $query->getArrayResult();

        $result = array();

        foreach ($data as $row) {
            $result[] = $row['name'];
        }

        return $result;
    }

    public function searchOutsideCost($filter = array())
    {
        $dql = "SELECT
                  oc
                FROM \Application\Entity\RediOutsideCost oc ";

        $dqlFilter = [];

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (oc.name LIKE :search) ";
        }

        if (count($dqlFilter)) {
            $dql .= " WHERE " . implode(" AND ", $dqlFilter);
        }

        $dql .= " ORDER BY oc.name ASC";

        $query = $this->getEntityManager()->createQuery($dql);

        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }

        $result = $query->getArrayResult();

        return $result;
    }


    public function updateEstimateHourAndTotal($estimateId)
    {
        // Get estimate data
        $estimate = $this->getById($estimateId);

        if ($estimate) {
            // Update hour value on redi_estimate_to_worker
            if ($estimate['timeUnit'] == 'D') {
                $updateWorkHourDql = "UPDATE redi_estimate_to_worker w
                                    LEFT JOIN
                                        redi_user u ON u.id = w.worker_id 
                                    SET 
                                        w.estimated_regular_hour = w.estimated_regular * IFNULL(u.min_hour, 0),
                                        w.estimated_overtime_hour = w.estimated_overtime * IFNULL(u.min_hour, 0),
                                        w.estimated_doubletime_hour = w.estimated_doubletime * IFNULL(u.min_hour, 0)
                                    WHERE
                                        w.estimate_id = :estimate_id";


            } else {
                $updateWorkHourDql = "UPDATE redi_estimate_to_worker w
                                    SET 
                                        w.estimated_regular_hour = w.estimated_regular,
                                        w.estimated_overtime_hour = w.estimated_overtime,
                                        w.estimated_doubletime_hour = w.estimated_doubletime
                                    WHERE
                                        w.estimate_id = :estimate_id";
            }

            $updateWorkHourQuery = $this->getEntityManager()->getConnection()->prepare($updateWorkHourDql);
            $updateWorkHourQuery->bindParam('estimate_id', $estimateId);
            $updateWorkHourQuery->execute();


            // Update total amount value on redi_estimate_to_worker
            $updateWorkerTotalDql = "UPDATE redi_estimate_to_worker w
                                        INNER JOIN
                                    redi_estimate e ON e.id = w.estimate_id
                                        INNER JOIN
                                    redi_user u ON w.worker_id = u.id 
                                SET 
                                    w.total_amount = (((u.hourly_rate * 1.0 * w.estimated_regular_hour) + (u.hourly_rate * 1.5 * estimated_overtime_hour) + (u.hourly_rate * 2.0 * estimated_doubletime_hour)) * e.multiplier)
                                    where IFNULL(w.total_amount, 0)=0
                                    AND w.estimate_id=:estimate_id";

            $updateWorkerTotalQuery = $this->getEntityManager()->getConnection()->prepare($updateWorkerTotalDql);
            $updateWorkerTotalQuery->bindParam('estimate_id', $estimateId);
            $updateWorkerTotalQuery->execute();

            // Update hour value on redi_estimate_temporary_staff
            if ($estimate['timeUnit'] == 'D') {
                $updateTempStaffHourDql = "UPDATE redi_estimate_temporary_staff ts
                                    INNER JOIN
                                        redi_setting s ON s.setting_key='TEMPORARY_STAFF_HOUR_PER_DAY' 
                                    SET 
                                        ts.hour=(ts.estimated_time * CAST(s.setting_value AS DECIMAL))
                                    WHERE
                                        ts.estimate_id = :estimate_id";


            } else {
                $updateTempStaffHourDql = "UPDATE redi_estimate_temporary_staff ts
                                    SET 
                                        ts.hour=ts.estimated_time
                                    WHERE
                                        ts.estimate_id = :estimate_id";
            }

            $updateTempStaffHourQuery = $this->getEntityManager()->getConnection()->prepare($updateTempStaffHourDql);
            $updateTempStaffHourQuery->bindParam('estimate_id', $estimateId);
            $updateTempStaffHourQuery->execute();

            // Update total amount value on redi_estimate_temporary_staff
            $updateTempStafferTotalDql = "UPDATE redi_estimate_temporary_staff ts
                                        SET 
                                            ts.total_amount = (ts.rate * ts.hour)
                                            where IFNULL(ts.total_amount, 0)=0
                                            AND ts.estimate_id=:estimate_id";

            $updateTempStafferTotalQuery = $this->getEntityManager()->getConnection()->prepare($updateTempStafferTotalDql);
            $updateTempStafferTotalQuery->bindParam('estimate_id', $estimateId);
            $updateTempStafferTotalQuery->execute();

            // Update redi_estimate  table total amount
            $updateEstimateTotalDql = "UPDATE redi_estimate 
                                            SET 
                                                total_amount = (((SELECT 
                                                        SUM(total_amount)
                                                    FROM
                                                        redi_estimate_to_worker
                                                    WHERE
                                                        estimate_id = :estimate_id) + (SELECT 
                                                        SUM(total_amount)
                                                    FROM
                                                        redi_estimate_temporary_staff
                                                    WHERE
                                                        estimate_id = :estimate_id) + (SELECT 
                                                        SUM(cost)
                                                    FROM
                                                        redi_estimate_to_outside_cost
                                                    WHERE
                                                        estimate_id = :estimate_id)))
                                            WHERE
                                                id = :estimate_id AND IFNULL(total_amount, 0) <= 0";

            $updateEstimateTotalQuery = $this->getEntityManager()->getConnection()->prepare($updateEstimateTotalDql);
            $updateEstimateTotalQuery->bindParam('estimate_id', $estimateId);
            $updateEstimateTotalQuery->execute();
        }
    }
}
