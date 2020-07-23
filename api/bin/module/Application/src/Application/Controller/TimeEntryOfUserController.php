<?php

namespace Application\Controller;

use Application\Entity\RediTimeEntry;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class TimeEntryOfUserController extends CustomAbstractActionController
{
    public function getList()
    {
        $workerId = (int)trim(isset($data['worker_id']) ? $data['worker_id'] : $this->_user_id);
        $startDate = $this->getRequest()->getQuery('start_date', null);
        $endDate = $this->getRequest()->getQuery('end_date', null);

        if($startDate && $endDate) {
            $dateRange = $this->_getDatesFromRange($startDate, $endDate, 'Y-m-d');

            $timeEntryData = $this->_timeEntryRepo->searchUserTimeEntry($startDate, $endDate, $workerId);

            $data = array();

            foreach ($dateRange as $range) {
                $data[$range] = [];
            }

            foreach ($timeEntryData as $row) {
                $rowDate = new \DateTime($row['startDate']);
                $rowDate = $rowDate->format('Y-m-d');

                $data[$rowDate][] = $row;
            }

            $response = array(
                'status' => 1,
                'message' => 'Request successful',
                'data' => $data
            );
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data.'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }


        return new JsonModel($response);
    }

    private function _getDatesFromRange($start, $end, $format = 'Y-m-d') {
        $array = array();
        $interval = new \DateInterval('P1D');

        $realEnd = new \DateTime($end);
        $realEnd->add($interval);

        $period = new \DatePeriod(new \DateTime($start), $interval, $realEnd);

        foreach($period as $date) {
            $array[] = $date->format($format);
        }

        return $array;
    }

}
