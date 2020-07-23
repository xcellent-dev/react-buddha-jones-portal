<?php

namespace Application\Controller;

use Application\Entity\RediTimeEntry;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class TimeEntrySubmitForReviewController extends CustomAbstractActionController
{
    public function create($data)
    {
        $newStatus = 3;

        $workerId = (int)trim(isset($data['worker_id']) ? $data['worker_id'] : $this->_user_id);
        $date = trim(isset($data['date']) ? $data['date'] : '');

        if($date) {
            $date = new \DateTime($date);
            $date = $date->format('Y-m-d');
        }

        if ($workerId && $date) {

            $timeEntry = $this->_timeEntryRepo->getUserTimeEntryOfADate($workerId, $date);

            foreach($timeEntry as $row) {
                $entry = $this->_timeEntryRepository->find($row['id']);

                $entry->setStatus($newStatus);
                            $this->_em->persist($entry);
            }


            $this->_em->flush();

            $response = array(
                'status' => 1,
                'message' => 'Request successful.'
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

}
