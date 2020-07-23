<?php

namespace Application\Controller;

use Application\Entity\RediEstimate;
use Application\Entity\RediEstimateToWorker;
use Application\Entity\RediProjectEditorProgress;
use Application\Entity\RediTimeEntry;
use Zend\Form\Element\DateTime;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class EditorProjectProgressController extends CustomAbstractActionController
{
    public function create($data)
    {
        $projectId = (int)(isset($data['project_id']) ? trim($data['project_id']) : 0);
        $campaignId = (int)(isset($data['campaign_id']) ? trim($data['campaign_id']) : 0);
        $spotId = (int)(isset($data['spot_id']) ? trim($data['spot_id']) : 0);
        $notes = trim(isset($data['notes']) ? $data['notes'] : '');
        $watched = isset($data['watched']) ? $data['watched'] : null;
        $borkenDown = isset($data['broken_down']) ? $data['broken_down'] : null;
        $statusId = isset($data['status_id']) ? (int)$data['status_id'] : null;
        $due = isset($data['due']) ? $data['due'] : null;
        $dueDate = isset($data['due_date']) ? $data['due_date'] : null;

        if ($projectId && $campaignId && $statusId) {
            $project = $this->_projectRepository->find($projectId);

            if ($project) {
                $campaign = $this->_campaignRepository->find($campaignId);

                if ($campaign) {
                    $checkFilter = array('projectId' => $projectId, 'campaignId' => $campaignId);

                    if($spotId) {
                        $checkFilter['spotId'] = $spotId;
                    } else {
                        $checkFilter['spotId'] = null;
                    }

                    $editorProgress = $this->_projectEditorProgressRepository->findOneBy($checkFilter);

                    if(!$editorProgress) {
                        $editorProgress = new RediProjectEditorProgress();
                        $editorProgress->setProjectId($projectId);
                        $editorProgress->setCampaignId($campaignId);
                    }

                    if ($spotId) {
                        $editorProgress->setSpotId($spotId);
                    }

                    if ($notes) {
                        $editorProgress->setNotes($notes);
                    }

                    if ($watched !== null) {
                        $editorProgress->setWatched($watched);
                    }

                    if ($borkenDown !== null) {
                        $editorProgress->setBrokenDown($borkenDown);
                    }

                    if ($statusId !== null) {
                        $editorProgress->setStatusId($statusId);
                    }

                    if ($due!==null) {
                        $editorProgress->setDue($due);
                    }

                    if ($dueDate!==null) {
                        $dueDateFormat = new \DateTime($dueDate);
                        $editorProgress->setDueDate($dueDateFormat);
                    }

                    $editorProgress->setUpdatedAt(new \DateTime('now'));

                    $this->_em->persist($editorProgress);
                    $this->_em->flush();

                    $response = array(
                        'status' => 1,
                        'message' => 'Request successful.'
                    );
                } else {
                    $response = array(
                        'status' => 0,
                        'message' => 'Campaign not found.'
                    );
                }
            } else {
                $response = array(
                    'status' => 0,
                    'message' => 'Project not found.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data(project_id, campaign_id, status_id).'
            );
        }


        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

}
