<?php

namespace Application\Controller;

use Application\Entity\RediBilling;
use Application\Entity\RediBillingActivity;
use Application\Entity\RediBillingApproval;
use Application\Entity\RediBillingEstimate;
use Application\Entity\RediEstimate;
use Application\Entity\RediEstimateToWorker;
use Application\Entity\RediTimeEntry;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class BillingApproveController extends CustomAbstractActionController
{

    function update($id, $data)
    {
        $approved = isset($data['approved']) ? (int)$data['approved'] : null;

        if ($id && $approved !== null) {
            $billing = $this->_billingRepository->find($id);

            if ($billing) {
                    $billingApproverId = $this->_billingRepo->getAllApproverId($id);

                    if(in_array($this->_user_id, $billingApproverId)) {
                        $approval = $this->_billingApprovalRepository->findOneBy(array('billId' => $id, 'userId' => $this->_user_id));

                        $approved = ($approved>=1)?1:0;

                        if($approval) {
                            $approval->setApproved($approved);
                            $this->_em->persist($approval);
                            $this->_em->flush();
                        }


                        $checkApproval = $this->_billingApprovalRepository->findOneBy(array('billId' => $id, 'approved' => 0));

                        if(!count($checkApproval)) {
                            $billing->setStatusId(3);
                        } else {
                            $billing->setStatusId(2);
                        }

                        $this->_em->persist($billing);
                        $this->_em->flush();

                        $response = array(
                            'status' => 1,
                            'message' => 'Request successful.'
                        );
                    } else {
                        $response = array(
                            'status' => 0,
                            'message' => 'User not in approver list.'
                        );
                    }
            } else {
                $response = array(
                    'status' => 0,
                    'message' => 'Billing data not found.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required parameter - approved.'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }
}
