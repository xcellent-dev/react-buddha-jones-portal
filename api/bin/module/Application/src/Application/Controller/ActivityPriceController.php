<?php

namespace Application\Controller;

use Application\Entity\RediActivity;
use Application\Entity\RediActivityTypeToActivity;
use Application\Entity\RediCustomer;
use Application\Entity\RediCustomerPrice;
use Application\Entity\RediEstimate;
use Application\Entity\RediEstimateToWorker;
use Application\Entity\RediTimeEntry;
use phpDocumentor\Reflection\Types\This;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class ActivityPriceController extends CustomAbstractActionController
{
    public function create($data)
    {
        $customerId = (int)(isset($data['customer_id']) ? trim($data['customer_id']) : 0);
        $activityId = (int)trim(isset($data['activity_id']) ? $data['activity_id'] : 0);
        $price = trim(isset($data['price']) ? $data['price'] : null);

        if ($customerId && $activityId && $price!==null) {
            if(strtolower($price)=='null') {
                $price = null;
            } else {
                $price = (float)$price;
            }

           $activity = $this->_activityRepository->find($activityId);

            if ($activity) {
                $customer = $this->_customerRepository->find($customerId);

                if($customer) {
                    $customerPrice = $this->_customerPriceRepository->findOneBy(array('customerId' => $customerId, 'activityId' => $activityId));

                    if(!$customerPrice) {
                        $customerPrice = new RediCustomerPrice();
                    }

                    $customerPrice->setActivityId($activityId);
                    $customerPrice->setCustomerId($customerId);
                    $customerPrice->setPrice($price);

                    $this->_em->persist($customerPrice);
                    $this->_em->flush();

                    $response = array(
                        'status' => 1,
                        'message' => 'Request successful.'
                    );
                } else {
                    $response = array(
                        'status' => 0,
                        'message' => 'Customer does not exists.'
                    );
                }
            } else {
                $response = array(
                    'status' => 0,
                    'message' => 'Activity does not exist.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data(customer_id, activity_id, price).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }



}
