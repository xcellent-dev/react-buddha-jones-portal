<?php

namespace Application\Controller;

use Application\Entity\RediProject;
use Application\Entity\RediProjectHistory;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class AssignSpotToCampaignController extends CustomAbstractActionController
{
    public function create($data)
    {
        $projectId = (int)(isset($data['project_id']) ? trim($data['project_id']) : 0);
        $spotId = (int)(isset($data['spot_id']) ? trim($data['spot_id']) : 0);
        $campaignId = (int)(isset($data['campaign_id']) ? trim($data['campaign_id']) : 0);

        if ($projectId && $spotId && $campaignId) {
            $project = $this->_projectRepository->find($projectId);

            if ($project) {
                $campaign = $this->_campaignRepository->find($campaignId);

                if ($campaign) {

                    $spot = $this->_spotRepository->find($spotId);

                    if ($spot) {
                        $spot->setProjectId($projectId);
                        $spot->setCampaignId($campaignId);

                        $this->_em->persist($spot);
                        $this->_em->flush();

                        // project history
                        $historyMessage = 'Spot "' . $spot->getSpotName() . '" was added to "' . $campaign->getCampaignName() . '"';
                        $projectHistory = new RediProjectHistory();
                        $projectHistory->setProjectId($projectId);
                        $projectHistory->setUserId($this->_user_id);
                        $projectHistory->setMessage($historyMessage);
                        $projectHistory->setCreatedAt(new \DateTime('now'));
                        $this->_em->persist($projectHistory);
                        $this->_em->flush();

                        $response = array(
                            'status' => 1,
                            'message' => 'Request successful.'
                        );
                    } else {
                        $response = array(
                            'status' => 0,
                            'message' => 'Spot not found.'
                        );
                    }
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
                'message' => 'Please provide required data(spot_id, project_id, campaign_id).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

}
