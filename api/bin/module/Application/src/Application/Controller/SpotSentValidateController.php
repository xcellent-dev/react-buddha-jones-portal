<?php

namespace Application\Controller;

use Application\Entity\RediProjectHistory;
use Application\Entity\RediSpot;
use Application\Entity\RediSpotSent;
use Application\Entity\RediSpotSentFile;
use Application\Entity\RediSpotSentToCustomerContact;
use Application\Entity\RediSpotSentToSpotVersion;
use Application\Entity\RediSpotSentToSpotVersionToEditorDesigner;
use Application\Entity\RediSpotSentToWorkStage;
use Zend\Db\Sql\Ddl\Column\Datetime;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class SpotSentValidateController extends CustomAbstractActionController
{
    public function update($id, $data)
    {
        $spotVersion = (array)json_decode(isset($data['spot_version']) ? trim($data['spot_version']) : null, true);
        $files = (array)json_decode(isset($data['file']) ? trim($data['file']) : null, true);
        $workStage = (array)json_decode(isset($data['work_stage']) ? trim($data['work_stage']) : null, true);
        $final = (isset($data['final']) && (int)trim($data['final'])) ? (int)trim($data['final']) : null;
        $status = (isset($data['status'])) ? (int)trim($data['status']) : null;

        $spotSent = $this->_spotSentRepository->find($id);

        if ($spotSent) {
            if ($this->_spotRepo->validateWorkStageForSpotSent($workStage)) {
                if ($final !== null) {
                    $spotSent->setFinal($final);
                }

                if ($status !== null) {
                    $spotSent->setStatus($status);
                }

                $this->_em->persist($spotSent);
                $this->_em->flush();

                // Handle work stage data
                if (count($workStage)) {
                    $existingSpotSentToWorkStage = $this->_spotSentToWorkStage->findBy(array('spotSentId' => $id));

                    if (count($existingSpotSentToWorkStage)) {
                        foreach ($existingSpotSentToWorkStage as $row) {
                            $this->_em->remove($row);
                        }

                        $this->_em->flush();
                    }

                    foreach ($workStage as $workStageId) {
                        $spotSentToWorkStage = new RediSpotSentToWorkStage();
                        $spotSentToWorkStage->setSpotSentId($id);
                        $spotSentToWorkStage->setWorkStageId($workStageId);
                        $this->_em->persist($spotSentToWorkStage);
                    }

                    $this->_em->flush();
                }

                // Handle spot version
                if (count($spotVersion)) {
                    $this->_spotRepo->clearSpotSentSpotVersion($id);
                    foreach ($spotVersion as $row) {
                        if (isset($row['spot_id'], $row['version_id']) && $row['spot_id'] && $row['version_id']) {
                            $spot = $this->_spotRepository->find($row['spot_id']);
                            $version = $this->_versionRepository->find($row['version_id']);

                            if ($spot && $version) {
                                $spotSentToSpotVersion = new RediSpotSentToSpotVersion();
                                $spotSentToSpotVersion->setSpotSentId($id);
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
                }

                if (count($files)) {
                    foreach ($files as $file) {
                        if (isset($file['name']) && $file['name']) {
                            $spotSentFile = new RediSpotSentFile();
                            $spotSentFile->setSpotSentId($id);
                            $spotSentFile->setFileName($file['name']);

                            if (isset($file['description']) && $file['description']) {
                                $spotSentFile->setFileDescription($file['description']);
                            }
                            $this->_em->persist($spotSentFile);
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
                    'message' => 'Please send stage of same parent stage.'
                );
            }

        } else {
            $response = array(
                'status' => 0,
                'message' => 'Spot sent entry not found.'
            );
        }

if ($response['status'] == 0) {
    $this->getResponse()->setStatusCode(400);
}

return new JsonModel($response);
}
}
