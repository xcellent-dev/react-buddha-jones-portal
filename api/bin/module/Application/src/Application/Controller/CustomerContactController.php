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

class CustomerContactController extends CustomAbstractActionController
{
    public function getList()
    {
        $filter['search'] = trim($this->getRequest()->getQuery('search', ''));
        $filter['customer_id'] = (int)$this->getRequest()->getQuery('customer_id', 0);

        if ($filter['customer_id']) {
            $data = $this->_customerRepo->searchCustomerContact($filter);

            $response = array(
                'status' => 1,
                'message' => 'Request successful',
                'data' => $data
            );


        } else {
            $response = array(
                'status' => 1,
                'message' => 'Please provide required parameter (customer_id)'
            );
        }


        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    public function create($data)
    {
        $customerId = (int)(isset($data['customer_id']) ? trim($data['customer_id']) : 0);
        $name = trim(isset($data['name']) ? $data['name'] : '');
        $email = trim(isset($data['email']) ? $data['email'] : '');
        $mobilePhone = trim(isset($data['mobile_phone']) ? $data['mobile_phone'] : '');
        $officePhone = trim(isset($data['office_phone']) ? $data['office_phone'] : '');
        $postalAddress = trim(isset($data['postal_address']) ? $data['postal_address'] : '');
        $projectCampaign = (array)json_decode(trim(isset($data['project_campaign']) ? $data['project_campaign'] : ''), true);

        if ($customerId && $name) {
            $customer = $this->_customerRepository->find($customerId);

            if ($customer) {
                $customerContact = new RediCustomerContact();
                $customerContact->setCustomerId($customerId);
                $customerContact->setName($name);
                $customerContact->setEmail($email);

                if ($mobilePhone) {
                    $customerContact->setMobilePhone($mobilePhone);
                }

                if ($officePhone) {
                    $customerContact->setOfficePhone($mobilePhone);
                }

                if ($postalAddress) {
                    $customerContact->setPostalAddress($postalAddress);
                }

                $this->_em->persist($customerContact);
                $this->_em->flush();

                $customerContactId = $customerContact->getId();

                if ($projectCampaign) {
                    foreach ($projectCampaign as $projectCampaignRow) {
                        if (isset($projectCampaignRow['project_id'], $projectCampaignRow['campaign_id']) && $projectCampaignRow['project_id'] && $projectCampaignRow['campaign_id']) {
                            $existingProjectCampaign = $this->_projectToCampaignRepository->findOneBy(array('projectId' => $projectCampaignRow['project_id'], 'campaignId' => $projectCampaignRow['campaign_id']));

                            if (!$existingProjectCampaign) {
                                $existingProjectCampaign = new RediProjectToCampaign();
                                $existingProjectCampaign->setProjectId($projectCampaignRow['project_id']);
                                $existingProjectCampaign->setCampaignId($projectCampaignRow['campaign_id']);

                                $this->_em->persist($existingProjectCampaign);
                                $this->_em->flush();
                            }

                            $customerContactToProjectCampaign = new RediCustomerContactToProjectCampaign();
                            $customerContactToProjectCampaign->setCustomerContactId($customerContactId);
                            $customerContactToProjectCampaign->setProjectToCampaignId($existingProjectCampaign->getId());
                            $this->_em->persist($customerContactToProjectCampaign);
                        }
                    }

                    $this->_em->flush();
                }

                $response = array(
                    'status' => 1,
                    'message' => 'Request successful.',
                    'data' => array(
                        'customer_contact_id' => $customerContactId
                    ),
                );
            } else {
                $response = array(
                    'status' => 0,
                    'message' => 'Customer not found.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data(name, email, customer_id).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    public function update($id, $data)
    {
        $customerId = (int)(isset($data['customer_id']) ? trim($data['customer_id']) : 0);
        $name = trim(isset($data['name']) ? $data['name'] : '');
        $email = trim(isset($data['email']) ? $data['email'] : '');
        $mobilePhone = trim(isset($data['mobile_phone']) ? $data['mobile_phone'] : '');
        $officePhone = trim(isset($data['office_phone']) ? $data['office_phone'] : '');
        $postalAddress = trim(isset($data['postal_address']) ? $data['postal_address'] : '');
        $projectCampaign = (array)json_decode(trim(isset($data['project_campaign']) ? $data['project_campaign'] : ''), true);

        $customerContact = $this->_customerContactRepository->find($id);

        if ($customerContact) {
            $customer = $this->_customerRepository->find($customerId);

            if ($customer) {
                if($customerId) {
                    $customerContact->setCustomerId($customerId);
                }

                if($name) {
                    $customerContact->setName($name);
                }

                if($email) {
                    $customerContact->setEmail($email);
                }

                if ($mobilePhone) {
                    $customerContact->setMobilePhone($mobilePhone);
                }

                if ($officePhone) {
                    $customerContact->setOfficePhone($mobilePhone);
                }

                if ($postalAddress) {
                    $customerContact->setPostalAddress($postalAddress);
                }

                $this->_em->persist($customerContact);
                $this->_em->flush();

                if ($projectCampaign) {
                    // Remove existing project campaign form customer contact
                    $projectCampaignCustomerContact = $this->_customerContactToProjectCampaignRepository->findBy(array('customerContactId' => $id));

                    if($projectCampaignCustomerContact) {
                        foreach($projectCampaignCustomerContact as $pccc) {
                            $this->_em->remove($pccc);
                        }
                    }

                    $this->_em->flush();

                    // Add new project campaign for customer contact
                    foreach ($projectCampaign as $projectCampaignRow) {
                        if (isset($projectCampaignRow['project_id'], $projectCampaignRow['campaign_id']) && $projectCampaignRow['project_id'] && $projectCampaignRow['campaign_id']) {
                            $existingProjectCampaign = $this->_projectToCampaignRepository->findOneBy(array('projectId' => $projectCampaignRow['project_id'], 'campaignId' => $projectCampaignRow['campaign_id']));

                            if (!$existingProjectCampaign) {
                                $existingProjectCampaign = new RediProjectToCampaign();
                                $existingProjectCampaign->setProjectId($projectCampaignRow['project_id']);
                                $existingProjectCampaign->setCampaignId($projectCampaignRow['campaign_id']);

                                $this->_em->persist($existingProjectCampaign);
                                $this->_em->flush();
                            }

                            $existingProjectCampaignCustomerContact = $this->_customerContactToProjectCampaignRepository->findOneBy(array('customerContactId' => $id, 'projectToCampaignId' => $existingProjectCampaign->getId()));

                            if(!$existingProjectCampaignCustomerContact) {
                                $customerContactToProjectCampaign = new RediCustomerContactToProjectCampaign();
                                $customerContactToProjectCampaign->setCustomerContactId($id);
                                $customerContactToProjectCampaign->setProjectToCampaignId($existingProjectCampaign->getId());
                                $this->_em->persist($customerContactToProjectCampaign);
                            }
                        }
                    }

                    $this->_em->flush();
                }

                $response = array(
                    'status' => 1,
                    'message' => 'Request successful.'
                );
            } else {
                $response = array(
                    'status' => 0,
                    'message' => 'Customer not found.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Customer contact not found'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    public function patch($id, $data)
    {
        $customerId = (int)(isset($data['customer_id']) ? trim($data['customer_id']) : 0);
        $name = trim(isset($data['name']) ? $data['name'] : '');
        $email = trim(isset($data['email']) ? $data['email'] : '');
        $mobilePhone = trim(isset($data['mobile_phone']) ? $data['mobile_phone'] : '');
        $officePhone = trim(isset($data['office_phone']) ? $data['office_phone'] : '');
        $postalAddress = trim(isset($data['postal_address']) ? $data['postal_address'] : '');
        $projectCampaign = (array)json_decode(trim(isset($data['project_campaign']) ? $data['project_campaign'] : ''), true);

        $customerContact = $this->_customerContactRepository->find($id);

        if ($customerContact) {
            $customer = $this->_customerRepository->find($customerId);

            if ($customer) {
                if($customerId) {
                    $customerContact->setCustomerId($customerId);
                }

                if($name) {
                    $customerContact->setName($name);
                }

                if($email) {
                    $customerContact->setEmail($email);
                }

                if ($mobilePhone) {
                    $customerContact->setMobilePhone($mobilePhone);
                }

                if ($officePhone) {
                    $customerContact->setOfficePhone($mobilePhone);
                }

                if ($postalAddress) {
                    $customerContact->setPostalAddress($postalAddress);
                }

                $this->_em->persist($customerContact);
                $this->_em->flush();

                if ($projectCampaign) {
                    // Add new project campaign for customer contact
                    foreach ($projectCampaign as $projectCampaignRow) {
                        if (isset($projectCampaignRow['project_id'], $projectCampaignRow['campaign_id']) && $projectCampaignRow['project_id'] && $projectCampaignRow['campaign_id']) {
                            $existingProjectCampaign = $this->_projectToCampaignRepository->findOneBy(array('projectId' => $projectCampaignRow['project_id'], 'campaignId' => $projectCampaignRow['campaign_id']));

                            if (!$existingProjectCampaign) {
                                $existingProjectCampaign = new RediProjectToCampaign();
                                $existingProjectCampaign->setProjectId($projectCampaignRow['project_id']);
                                $existingProjectCampaign->setCampaignId($projectCampaignRow['campaign_id']);

                                $this->_em->persist($existingProjectCampaign);
                                $this->_em->flush();
                            }

                            $existingProjectCampaignCustomerContact = $this->_customerContactToProjectCampaignRepository->findOneBy(array('customerContactId' => $id, 'projectToCampaignId' => $existingProjectCampaign->getId()));

                            if(!$existingProjectCampaignCustomerContact) {
                                $customerContactToProjectCampaign = new RediCustomerContactToProjectCampaign();
                                $customerContactToProjectCampaign->setCustomerContactId($id);
                                $customerContactToProjectCampaign->setProjectToCampaignId($existingProjectCampaign->getId());
                                $this->_em->persist($customerContactToProjectCampaign);
                            }
                        }
                    }

                    $this->_em->flush();
                }

                $response = array(
                    'status' => 1,
                    'message' => 'Request successful.'
                );
            } else {
                $response = array(
                    'status' => 0,
                    'message' => 'Customer not found.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Customer contact not found'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

}
