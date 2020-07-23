<?php

namespace Application\Controller;

use Application\Entity\RediProject;
use Application\Entity\RediProjectHistory;
use Application\Entity\RediProjectManager;
use Application\Entity\RediProjectProducer;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class ProjectController extends CustomAbstractActionController
{
    public function getList()
    {
        $filter['search'] = trim($this->getRequest()->getQuery('search', ''));
        $filter['customer_id'] = (int)$this->getRequest()->getQuery('customer_id', 0);
        $filter['detailed'] = (int)$this->getRequest()->getQuery('detailed', 0);
        $filter['sort'] = $this->getRequest()->getQuery('sort', 'id');
        $offset = (int)trim($this->getRequest()->getQuery('offset', 0));
        $length = (int)trim($this->getRequest()->getQuery('length', 10));

        $filter['image_path'] = $this->_siteUrl . 'thumb/profile_image/';

        if ($filter['detailed']) {
            $data = $this->_projectRepo->searchDetailed($filter, $offset, $length);
        } else {
            $data = $this->_projectRepo->search($filter, $offset, $length);
        }

        $totalCount = $this->_projectRepo->searchCount($filter);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'total_count' => $totalCount,
            'object_count' => count($data),
            'data' => $data
        );


        return new JsonModel($response);
    }

    public function get($projectId) {
        $filter['project_id'] = $projectId;
        $filter['sort'] = 'id';
        $filter['detailed'] = $this->getRequest()->getQuery('detailed', 0);
        $filter['image_path'] = $this->_siteUrl . 'thumb/profile_image/';

        if ($filter['detailed']) {
            $data = $this->_projectRepo->searchDetailed($filter, 0, 1, true);
        } else {
            $data = $this->_projectRepo->search($filter, 0, 1, true);
        }

        if(count($data)) {
            $response = array(
                'status' => 1,
                'message' => "Request successful",
                'data' => $data[0]
            );
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Project not found'
            );
        }


        if($response['status']==0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }


    public function create($data)
    {
        $customerId = (int)(isset($data['customer_id']) ? trim($data['customer_id']) : 0);
        $projectName = trim(isset($data['name']) ? $data['name'] : '');
        $notes = trim(isset($data['notes']) ? $data['notes'] : '');

        if ($customerId && $projectName) {
            $customer = $this->_customerRepository->find($customerId);

            if ($customer) {
                $project = new RediProject();
                $project->setCustomerId($customerId);
                $project->setProjectName($projectName);

                if ($notes) {
                    $project->setNotes($notes);
                }

                $this->_em->persist($project);
                $this->_em->flush();

                $projectId = $project->getId();

                // project history
                $historyMessage = 'Project "' . $projectName . '" created for client "' . $customer->getCustomerName() . '"';
                $projectHistory = new RediProjectHistory();
                $projectHistory->setProjectId($projectId);
                $projectHistory->setUserId($this->_user_id);
                $projectHistory->setMessage($historyMessage);
                $projectHistory->setCreatedAt(new \DateTime('now'));
                $this->_em->persist($projectHistory);
                $this->_em->flush();

                $response = array(
                    'status' => 1,
                    'message' => 'Request successful.',
                    'data' => array(
                        'project_id' => $projectId
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
                'message' => 'Please provide required data(name, customer_id).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    public function update($id, $data)
    {
        $customerId = isset($data['customer_id']) ? (int)trim($data['customer_id']) : null;
        $projectName = isset($data['name']) ? trim($data['name']) : null;
        $notes = isset($data['notes']) ? trim($data['notes']) : null;

        $project = $this->_projectRepository->find($id);

        if ($project) {
            if ($customerId || $projectName || $notes) {
                if ($projectName) {
                    if ($project->getProjectName() != $projectName) {
                        // project history
                        $historyMessage = 'Project renamed to "' . $projectName . '" from "' . $project->getProjectName() . '"';
                        $projectHistory = new RediProjectHistory();
                        $projectHistory->setProjectId($id);
                        $projectHistory->setMessage($historyMessage);
                        $projectHistory->setCreatedAt(new \DateTime('now'));
                        $this->_em->persist($projectHistory);
//                        $this->_em->flush();
                    }
                    $project->setProjectName($projectName);
                }



                if ($customerId) {
                    $customer = $this->_customerRepository->find($customerId);

                    if ($customer) {
                        if ($project->getCustomerId() != $customerId) {
                            $previousCustomer = $this->_customerRepository->find($project->getCustomerId());

                            // project history
                            $historyMessage = 'Project customer changed to "' . $customer->getCustomerName() . '" from "' . $previousCustomer->getCustomerName() . '"';
                            $projectHistory = new RediProjectHistory();
                            $projectHistory->setProjectId($id);
                            $projectHistory->setUserId($this->_user_id);
                            $projectHistory->setMessage($historyMessage);
                            $projectHistory->setCreatedAt(new \DateTime('now'));
                            $this->_em->persist($projectHistory);
//                            $this->_em->flush();
                        }

                        $project->setCustomerId($customerId);
                    }
                }

                if ($notes) {
                    $project->setNotes($notes);
                }

                $this->_em->persist($project);
                $this->_em->flush();


                $response = array(
                    'status' => 1,
                    'message' => 'Project updated successfully.'
                );

            } else {
                $response = array(
                    'status' => 0,
                    'message' => 'Please provide required data.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Project not found.'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

}
