<?php

namespace Application\Controller;

use Application\Entity\RediCustomerContact;
use Application\Entity\RediCustomerContactToProjectCampaign;
use Application\Entity\RediProject;
use Application\Entity\RediProjectHistory;
use Application\Entity\RediProjectManager;
use Application\Entity\RediProjectProducer;
use Application\Entity\RediProjectToCampaign;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class AssignCustomerContactToProjectCampaignController extends CustomAbstractActionController
{
    public function create($data)
    {
        $contactId = (int)(isset($data['contact_id']) ? trim($data['contact_id']) : 0);
        $projectId = (int)(isset($data['project_id']) ? trim($data['project_id']) : 0);
        $campaignId = (int)(isset($data['campaign_id']) ? trim($data['campaign_id']) : 0);

        if ($contactId && $projectId && $campaignId) {
            $existingProjectCampaign = $this->_projectToCampaignRepository->findOneBy(array('projectId' => $projectId, 'campaignId' => $campaignId));

            $entryExists = false;

            if ($existingProjectCampaign) {
                $checkCustomerContactToProjectCampaign = $this->_customerContactToProjectCampaignRepository->findOneBy(array('customerContactId' => $contactId, 'projectToCampaignId' => $existingProjectCampaign->getId()));

                if ($checkCustomerContactToProjectCampaign) {
                    $entryExists = true;
                }
            } else {
                $existingProjectCampaign = new RediProjectToCampaign();
                $existingProjectCampaign->setProjectId($projectId);
                $existingProjectCampaign->setCampaignId($campaignId);

                $this->_em->persist($existingProjectCampaign);
                $this->_em->flush();
            }

            if (!$entryExists) {
                $customerContactToProjectCampaign = new RediCustomerContactToProjectCampaign();
                $customerContactToProjectCampaign->setCustomerContactId($contactId);
                $customerContactToProjectCampaign->setProjectToCampaignId($existingProjectCampaign->getId());
                $this->_em->persist($customerContactToProjectCampaign);

                $this->_em->flush();
            }

            $response = array(
                'status' => 1,
                'message' => 'Request successful.'
            );

        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data(contact_id, project_id, campaign_id).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    public function delete($contactId)
    {

        $projectId = $this->params()->fromRoute('param1', 0);
        $campaignId = $this->params()->fromRoute('param2', 0);

        if ($contactId && $projectId && $campaignId) {
            $existingProjectCampaign = $this->_projectToCampaignRepository->findOneBy(array('projectId' => $projectId, 'campaignId' => $campaignId));

            if ($existingProjectCampaign) {
                $checkCustomerContactToProjectCampaign = $this->_customerContactToProjectCampaignRepository->findOneBy(array('customerContactId' => $contactId, 'projectToCampaignId' => $existingProjectCampaign->getId()));

                if ($checkCustomerContactToProjectCampaign) {
                    $this->_em->remove($checkCustomerContactToProjectCampaign);
                    $this->_em->flush();
                }
            }

            $response = array(
                'status' => 1,
                'message' => 'Request successful.'
            );

        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data(contact_id, project_id, campaign_id).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

}
