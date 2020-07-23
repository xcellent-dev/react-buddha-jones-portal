<?php

namespace Application\Controller;

use Application\Entity\RediProject;
use Application\Entity\RediProjectHistory;
use Application\Entity\RediSpotVersion;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class AssignVersionToSpotController extends CustomAbstractActionController
{
    public function create($data)
    {
        $versionId = (int)(isset($data['version_id']) ? trim($data['version_id']) : 0);
        $spotId = (int)(isset($data['spot_id']) ? trim($data['spot_id']) : 0);

        if ($versionId && $spotId) {
            $version = $this->_versionRepository->find($versionId);

            if ($version) {
                $spot = $this->_spotRepository->find($spotId);

                if ($spot) {
                    $existingSpotVersion = $this->_spotVersionRepository->findOneBy(array('spotId' => $spotId, 'versionId' => $versionId));

                    if(!$existingSpotVersion) {
                        $existingSpotVersion = new RediSpotVersion();
                        $existingSpotVersion->setVersionId($versionId);
                        $existingSpotVersion->setSpotId($spotId);

                        $this->_em->persist($existingSpotVersion);

                        // project history
                        $historyMessage = 'Version "' . $version->getVersionName() . '" was added to spot "' . $spot->getSpotName(). '"';
                        $projectHistory = new RediProjectHistory();
                        $projectHistory->setProjectId($spot->getProjectId());
                        $projectHistory->setUserId($this->_user_id);
                        $projectHistory->setMessage($historyMessage);
                        $projectHistory->setCreatedAt(new \DateTime('now'));
                        $this->_em->persist($projectHistory);

                        $this->_em->flush();
                    }


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
                    'message' => 'Version not found.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data(version_id, spot_id).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    public function delete($versionId)
    {
        $spotId = $this->params()->fromRoute('param1', 0);

        if ($versionId && $spotId) {
            $version = $this->_versionRepository->find($versionId);

            if ($version) {
                $spot = $this->_spotRepository->find($spotId);

                if ($spot) {
                    $existingSpotVersion = $this->_spotVersionRepository->findOneBy(array('spotId' => $spotId, 'versionId' => $versionId));

                    if($existingSpotVersion) {
                        $this->_em->remove($existingSpotVersion);

                        // project history
                        $historyMessage = 'Version "' . $version->getVersionName() . '" was removed from spot "' . $spot->getSpotName(). '"';
                        $projectHistory = new RediProjectHistory();
                        $projectHistory->setProjectId($spot->getProjectId());
                        $projectHistory->setUserId($this->_user_id);
                        $projectHistory->setMessage($historyMessage);
                        $projectHistory->setCreatedAt(new \DateTime('now'));
                        $this->_em->persist($projectHistory);

                        $this->_em->flush();
                    }

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
                    'message' => 'Version not found.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data(version_id, spot_id).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

}
