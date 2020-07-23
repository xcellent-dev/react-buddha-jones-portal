<?php

namespace Application\Controller;

use Application\Entity\RediEditorToSpot;
use Application\Entity\RediEstimate;
use Application\Entity\RediEstimateToWorker;
use Application\Entity\RediProjectEditorProgress;
use Application\Entity\RediTimeEntry;
use Zend\Form\Element\DateTime;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class EditorProjectController extends CustomAbstractActionController
{
    public function getList()
    {
        $offset = (int)$this->getRequest()->getQuery('offset', 0);
        $length = (int)$this->getRequest()->getQuery('length', 20);

        $data = $this->_projectRepo->getFullEditorProject(null, $offset, $length);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $data
        );


        return new JsonModel($response);
    }

    public function get($id)
    {
        $offset = (int)$this->getRequest()->getQuery('offset', 0);
        $length = (int)$this->getRequest()->getQuery('length', 20);

        $data = $this->_projectRepo->getFullEditorProject($id, $offset, $length);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $data
        );


        return new JsonModel($response);
    }

    public function create($data)
    {
        $editorId = (int)(isset($data['editor_id']) ? trim($data['editor_id']) : 0);
        $spotId = (int)(isset($data['spot_id']) ? trim($data['spot_id']) : 0);

        if ($editorId && $spotId) {
            $spot = $this->_spotRepository->find($spotId);

            if ($spot) {
                $editor = $this->_userRepository->find($editorId);

                if ($editor) {
                    $existingEditorSpot = $this->_editorToSpotRepository->findOneBy(array('editorId' => $editorId, 'spotId' => $spotId));

                    if(!$existingEditorSpot) {
                        $editorSpot = new RediEditorToSpot();
                        $editorSpot->setEditorId($editorId);
                        $editorSpot->setSpotId($spotId);

                        $this->_em->persist($editorSpot);
                        $this->_em->flush();
                    }

                    $response = array(
                        'status' => 1,
                        'message' => 'Request successful.'
                    );
                } else {
                    $response = array(
                        'status' => 0,
                        'message' => 'Editor (user) not found.'
                    );
                }
            } else {
                $response = array(
                    'status' => 0,
                    'message' => 'Spot not found.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data(editor_id, spot_id).'
            );
        }


        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

}
