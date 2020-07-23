<?php
namespace Application\Controller;

use Application\Entity\RediActivity;
use Application\Entity\RediActivityTypeToActivity;
use Zend\View\Model\JsonModel;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class ActivityController extends CustomAbstractActionController
{
    public function getList()
    {
        $filter['search'] = trim($this->getRequest()->getQuery('search', ''));
        $filter['type_id'] = (array)json_decode(trim($this->getRequest()->getQuery('type_id', '')), true);
        $filter['user_type_id'] = $this->getRequest()->getQuery('user_type_id', null);

        $filter['customer_id'] = (int)trim($this->getRequest()->getQuery('customer_id', 0));

        if($filter['customer_id']) {
            $data = $this->_activityRepo->searchWithPrice($filter);
        } else {
            $data = $this->_activityRepo->search($filter);
        }

        $totalCount = $this->_activityRepo->searchCount($filter);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'total_count' => $totalCount,
            'data' => $data
        );

        return new JsonModel($response);
    }

    public function create($data)
    {
        $typeId = (int)(isset($data['type_id']) ? trim($data['type_id']) : 0);
        $userTypeId = (isset($data['user_type_id']) ? (int)trim($data['user_type_id']) : null);
        $name = trim(isset($data['name']) ? $data['name'] : '');
        $status = (int)trim(isset($data['status']) ? $data['status'] : 1);

        if ($name && $typeId) {
           $checkActivity = $this->_activityRepository->findOneBy(array('name' => $name));

            if (!$checkActivity) {
                $activity = new RediActivity();
                $activity->setName($name);
                $activity->setStatus($status);
                $activity->setTypeId($typeId);

                if($userTypeId) {
                    $activity->setUserTypeId($userTypeId);
                }

                $this->_em->persist($activity);
                $this->_em->flush();

                $activityId = $activity->getId();

                $response = array(
                    'status' => 1,
                    'message' => 'Request successful.',
                    'data' => array(
                        'activity_id' => $activityId
                    ),
                );
            } else {
                $response = array(
                    'status' => 0,
                    'message' => 'Activity name already exists.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data(name, type_id).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    public function update($id, $data)
    {
        $typeId = isset($data['type_id']) ? (int)trim($data['type_id']) : null;
        $userTypeId = (isset($data['user_type_id']) ? (int)trim($data['user_type_id']) : null);
        $name = isset($data['name']) ? trim($data['name']) : null;
        $status = isset($data['status']) ? (int)trim($data['status']) : null;

        $activity = $this->_activityRepository->find($id);

        if($activity) {
            if ($typeId || $name) {
                if ($name) {
                    $checkActivity = $this->_activityRepository->findOneBy(array('name' => $name));

                    if(!$checkActivity) {
                        $activity->setName($name);
                    }
                }


                if($status!==null) {
                    $activity->setStatus($status);
                }

                if($typeId!==null) {
                    $activity->setTypeId($typeId);
                }

                if($userTypeId) {
                    $activity->setUserTypeId($userTypeId);
                }

                $this->_em->persist($activity);
                $this->_em->flush();


                $response = array(
                    'status' => 1,
                    'message' => 'Activity updated successfully.'
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
                'message' => 'Activity not found.'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

}
