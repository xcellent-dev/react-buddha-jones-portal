<?php

namespace Application\Controller;

use Application\Entity\RediProjectHistory;
use Application\Entity\RediSpot;
use Application\Entity\RediSpotSent;
use Application\Entity\RediSpotSentToCustomerContact;
use Application\Entity\RediSpotSentToSpotVersion;
use Application\Entity\RediSpotSentToSpotVersionToEditorDesigner;
use Zend\Db\Sql\Ddl\Column\Datetime;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class SpotSentController extends CustomAbstractActionController
{
    public function getList()
    {

        $workTypeId = (int)trim($this->getRequest()->getQuery('work_type', ''));
        $sentViaMethodId = (int)trim($this->getRequest()->getQuery('sent_via_method', ''));
        $statusId = (int)trim($this->getRequest()->getQuery('status', ''));
        $offset = (int)trim($this->getRequest()->getQuery('offset', 0));
        $length = (int)trim($this->getRequest()->getQuery('length', 10));

        $data = $this->_spotRepo->searchSpotSent($workTypeId, $sentViaMethodId, $statusId, $offset, $length);
        $totalCount = $this->_spotRepo->searchSpotSentCount($workTypeId, $sentViaMethodId, $statusId);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'total_count' => $totalCount,
            'object_count' => count($data),
            'data' => $data
        );

        return new JsonModel($response);
    }

    public function get($spotSentId)
    {
        $data = $this->_spotRepo->getSpotSent($spotSentId);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $data
        );

        return new JsonModel($response);
    }

    public function create($data)
    {
        $date = trim(isset($data['date']) ? $data['date'] : 'now');
        $spotVersion = (array)json_decode(isset($data['spot_version']) ? trim($data['spot_version']) : null, true);
        $customerContact = (array)json_decode(isset($data['customer_contact']) ? trim($data['customer_contact']) : null, true);
        $sentViaMethod = (int)trim(isset($data['sent_via_method']) ? $data['sent_via_method'] : '');
        $notes = trim(isset($data['notes']) ? $data['notes'] : '');
        $workType = (int)trim(isset($data['work_type']) ? $data['work_type'] : '');
        $status = (int)trim(isset($data['status']) ? $data['status'] : '');

        $date = new \DateTime($date);

        if ($workType && $sentViaMethod) {
            $spotSent = new RediSpotSent();
            $spotSent->setWorkTypeId($workType);
            $spotSent->setDate($date);
            $spotSent->setSentViaMethodId($sentViaMethod);

            if ($notes) {
                $spotSent->setNotes($notes);
            }

            if ($status) {
                $spotSent->setStatusId($status);
            }

            $this->_em->persist($spotSent);
            $this->_em->flush();

            $spotSentId = $spotSent->getId();

            foreach ($spotVersion as $row) {
                if (isset($row['spot_id'], $row['version_id']) && $row['spot_id'] && $row['version_id']) {
                    $spot = $this->_spotRepository->find($row['spot_id']);
                    $version = $this->_versionRepository->find($row['version_id']);

                    if ($spot && $version) {
                        $spotSentToSpotVersion = new RediSpotSentToSpotVersion();
                        $spotSentToSpotVersion->setSpotSentId($spotSentId);
                        $spotSentToSpotVersion->setSpotId($row['spot_id']);
                        $spotSentToSpotVersion->setVersionId($row['version_id']);
                        $this->_em->persist($spotSentToSpotVersion);
                        $this->_em->flush();

                        $spotSentToSpotVersionId = $spotSentToSpotVersion->getid();

                        $editorDesigner = isset($row['worker']) ? $row['worker'] : [];

                        if (count($editorDesigner)) {
                            foreach ($editorDesigner as $editorDesignerId) {
                                if ($editorDesignerId) {
                                    $rediSpotSentToSpotVersionToEditorDesigner = new RediSpotSentToSpotVersionToEditorDesigner();
                                    $rediSpotSentToSpotVersionToEditorDesigner->setSpotSentSpotVersionId($spotSentToSpotVersionId);
                                    $rediSpotSentToSpotVersionToEditorDesigner->setEditorDesignerId($editorDesignerId);
                                    $this->_em->persist($rediSpotSentToSpotVersionToEditorDesigner);
                                }
                            }
                        }

                        $this->_em->flush();
                    }
                }
            }

            if (count($customerContact)) {
                foreach ($customerContact as $customerContactId) {
                    if ($customerContactId) {
                        $rediSpotSentToCustomerContact = new RediSpotSentToCustomerContact();
                        $rediSpotSentToCustomerContact->setSpotSentId($spotSentId);
                        $rediSpotSentToCustomerContact->setCustomerContactId($customerContactId);
                        $this->_em->persist($rediSpotSentToCustomerContact);
                    }
                }


                $this->_em->flush();
            }

            $response = array(
                'status' => 1,
                'message' => 'Request successful.',
                'data' => array(
                    'spot_sent_id' => $spotSentId
                ),
            );
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data(work_type, sent_via_method).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }
}
