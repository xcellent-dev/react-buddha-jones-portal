<?php

namespace Application\Controller;

use Application\Entity\RediCampaign;
use Application\Entity\RediProjectCampaignManager;
use Application\Entity\RediProjectCampaignProducer;

use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class AssignManagementToCampaignController extends CustomAbstractActionController
{
    public function create($data)
    {
        $projectId = (int)(isset($data['project_id']) ? trim($data['project_id']) : 0);
        $campaignId = (int)(isset($data['campaign_id']) ? trim($data['campaign_id']) : 0);
        $userId = (int)(isset($data['user_id']) ? trim($data['user_id']) : 0);
        $userTypeId = (int)(isset($data['user_type_id']) ? trim($data['user_type_id']) : 0);

        if ($projectId && $campaignId && $userId && $userTypeId) {
            $project = $this->_projectRepository->find($projectId);

            if ($project) {
                $campaign = $this->_campaignRepository->find($campaignId);

                if ($campaign) {
                    $projectToCampaign = $this->_projectToCampaignRepository->findOneBy(array(
                        'projectId' => $projectId,
                        'campaignId' => $campaignId
                    ));

                    if ($projectToCampaign) {
                        $projectToCampaignId = $projectToCampaign->getId();

                        $user = $this->_userRepository->find($userId);
                        if ($user) {

                            $userType = $this->_userTypeRepository->find($userTypeId);
                            if ($userType) {

                                $userTypeName = $userType->getTypeName();
                                if ($userTypeName == 'Manager') {

                                    $existingCampaignManager = $this->_projectCampaignManagerRepository->findOneBy(array(
                                        'projectCampaignId' => $projectToCampaignId,
                                        'managerId' => $userId
                                    ));

                                    if (!$existingCampaignManager) {
                                        $campaignManager = new RediProjectCampaignManager();
                                        $campaignManager->setProjectCampaignId($projectToCampaignId);
                                        $campaignManager->setManagerId($userId);
                                        $this->_em->persist($campaignManager);
                                        $this->_em->flush();
                                    }

                                    $response = array(
                                        'status' => 1,
                                        'message' => 'Management person has been assigned to the project and campaign.'
                                    );

                                } elseif ($userTypeName == 'Producer') {

                                    $existingCampaignProducer = $this->_projectCampaignProducerRepository->findOneBy(array(
                                        'projectCampaignId' => $projectToCampaignId,
                                        'producerId' => $userId
                                    ));

                                    if (!$existingCampaignProducer) {
                                        $campaignProducer = new RediProjectCampaignProducer();
                                        $campaignProducer->setProjectCampaignId($projectToCampaignId);
                                        $campaignProducer->setProducerId($userId);
                                        $this->_em->persist($campaignProducer);
                                        $this->_em->flush();
                                    }

                                    $response = array(
                                        'status' => 1,
                                        'message' => 'Management person has been assigned to the project and campaign.'
                                    );

                                } else {
                                    $response = array(
                                        'status' => 0,
                                        'message' => 'Management type is not part of management.'
                                    );
                                }

                            } else {
                                $response = array(
                                    'status' => 0,
                                    'message' => 'Management type not found.'
                                );
                            }
                        } else {
                            $response = array(
                                'status' => 0,
                                'message' => 'Management person not found.'
                            );
                        }
                    } else {
                        $response = array(
                            'status' => 0,
                            'message' => 'Campaign to project relationship not found.'
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
                'message' => 'Please provide required data (campaign_id, user_id, user_type_id).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    public function delete($userId)
    {
        $userTypeId = $this->params()->fromRoute('param1', 0);
        $campaignId = $this->params()->fromRoute('param2', 0);
        $projectId = $this->params()->fromRoute('param3', 0);

        if ($userId && $userTypeId && $campaignId && $projectId) {

            $project = $this->_projectRepository->find($projectId);
            if ($project) {

                $campaign = $this->_campaignRepository->find($campaignId);
                if ($campaign) {

                    $projectToCampaign = $this->_projectToCampaignRepository->findOneBy(array(
                        'projectId' => $projectId,
                        'campaignId' => $campaignId
                    ));
                    if ($projectToCampaign) {
                        $projectToCampaignId = $projectToCampaign->getId();

                        $user = $this->_userRepository->find($userId);
                        if ($user) {

                            $userType = $this->_userTypeRepository->find($userTypeId);
                            if ($userType) {

                                $userTypeName = $userType->getTypeName();
                                if ($userTypeName == 'Manager') {

                                    $existingCampaignManager = $this->_projectCampaignManagerRepository->findOneBy(array(
                                        'projectCampaignId' => $projectToCampaignId,
                                        'managerId' => $userId
                                    ));

                                    if ($existingCampaignManager) {
                                        $this->_em->remove($existingCampaignManager);
                                        $this->_em->flush();
                                    }

                                    $response = array(
                                        'status' => 1,
                                        'message' => 'Management person has been removed from the project and campaign.'
                                    );

                                } elseif ($userTypeName == 'Producer') {

                                    $existingCampaignProducer = $this->_projectCampaignProducerRepository->findOneBy(array(
                                        'projectCampaignId' => $projectToCampaignId,
                                        'producerId' => $userId
                                    ));

                                    if ($existingCampaignProducer) {
                                        $this->_em->remove($existingCampaignProducer);
                                        $this->_em->flush();
                                    }

                                    $response = array(
                                        'status' => 1,
                                        'message' => 'Management person has been removed from the project and campaign.'
                                    );

                                } else {
                                    $response = array(
                                        'status' => 0,
                                        'message' => 'Management type is not part of management.'
                                    );
                                }
                            } else {
                                $response = array(
                                    'status' => 0,
                                    'message' => 'Management type not found.'
                                );
                            }
                        } else {
                            $response = array(
                                'status' => 0,
                                'message' => 'Management person not found.'
                            );
                        }
                    } else {
                        $response = array(
                            'status' => 0,
                            'message' => 'Campaign to project relationship not found.'
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
                'message' => 'Please provide required data (/user_id/user_type_id/campaign_id/project_id).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }
}
