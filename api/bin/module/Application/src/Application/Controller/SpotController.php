<?php

namespace Application\Controller;

use Application\Entity\RediProjectHistory;
use Application\Entity\RediSpot;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class SpotController extends CustomAbstractActionController
{
    public function getList()
    {
        $search = trim($this->getRequest()->getQuery('search', ''));
        $projectId = (int)trim($this->getRequest()->getQuery('project_id', 0));
        $campaignId = (int)trim($this->getRequest()->getQuery('campaign_id', 0));
        $offset = (int)trim($this->getRequest()->getQuery('offset', 0));
        $length = (int)trim($this->getRequest()->getQuery('length', 10));

        $data = $this->_spotRepo->search($projectId, $campaignId, $search, $offset, $length);
        $totalCount = $this->_spotRepo->searchCount($projectId, $campaignId, $search);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'total_count' => $totalCount,
            'object_count' => count($data),
            'data' => $data
        );


        return new JsonModel($response);
    }

    public function get($spotId)
    {
        $data = $this->_spotRepo->getById($spotId);

        if(isset($data['id'])) {
            $data['id'] = (int)$data['id'];
        }

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $data
        );


        return new JsonModel($response);
    }

    public function create($data)
    {
        $projectId = (int)(isset($data['project_id']) ? trim($data['project_id']) : 0);
        $campaignId = (int)(isset($data['campaign_id']) ? trim($data['campaign_id']) : 0);
        $name = trim(isset($data['name']) ? $data['name'] : '');
        $notes = trim(isset($data['notes']) ? $data['notes'] : '');


        $revisions = (isset($data['revisions']) ? (int)trim($data['revisions']) : null);
        $graphicsRevisions = (int)(isset($data['graphics_revisions']) ? trim($data['graphics_revisions']) : 0);
        $firstRevisionCost = (isset($data['first_revision_cost']) ? (float)trim($data['first_revision_cost']) : null);

        if ($name && $projectId && $campaignId) {
            $project = $this->_projectRepository->find($projectId);
            $campaign = $this->_campaignRepository->find($campaignId);

            if ($project) {
                if ($campaign) {
                    $spot = new RediSpot();
                    $spot->setSpotName($name);

                    $spot->setProjectId($projectId);
                    $spot->setCampaignId($campaignId);

                    if ($notes) {
                        $spot->setNotes($notes);
                    }

                    $spot->setRevisions($revisions);
                    $spot->setGraphicsRevisions($graphicsRevisions);
                    $spot->setFirstRevisionCost($firstRevisionCost);

                    $this->_em->persist($spot);


                    // project history
                    $historyMessage = 'Spot "' . $name . '" was added to "' . $campaign->getCampaignName() . '" campaign';
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
                            'spot_id' => $spot->getId()
                        ),
                    );
                } else {
                    $response = array(
                        'status' => 0,
                        'message' => 'Campaign not found.'
                    );
                }
            } else {
                $response = array(
                    'status' => 0,
                    'message' => 'Project not found.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data(name, project_id, campaign_id).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    public function update($id, $data)
    {

        $projectId = (int)(isset($data['project_id']) ? trim($data['project_id']) : 0);
        $campaignId = (int)(isset($data['campaign_id']) ? trim($data['campaign_id']) : 0);
        $name = trim(isset($data['name']) ? $data['name'] : '');
        $notes = trim(isset($data['notes']) ? $data['notes'] : '');

        $revisions = (isset($data['revisions']) ? (int)trim($data['revisions']) : null);
        $graphicsRevisions = (int)(isset($data['graphics_revisions']) ? trim($data['graphics_revisions']) : 0);
        $firstRevisionCost = (isset($data['first_revision_cost']) ? (float)trim($data['first_revision_cost']) : null);

        $spot = $this->_spotRepository->find($id);

        if ($spot) {
            if ($name) {
                $spot->setSpotName($name);
            }

            if ($projectId) {
                $spot->setProjectId($projectId);
            }

            if ($campaignId) {
                $spot->setCampaignId($campaignId);
            }

            if ($notes) {
                $spot->setNotes($notes);
            }

            if ($revisions) {
                $spot->setRevisions($revisions);
            }

            if ($graphicsRevisions) {
                $spot->setGraphicsRevisions($graphicsRevisions);
            }

            if ($firstRevisionCost) {
                $spot->setFirstRevisionCost($firstRevisionCost);
            }

            $this->_em->persist($spot);
            $this->_em->flush();

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

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    public function delete($id)
    {
        $spot = $this->_spotRepository->find($id);

        if ($spot) {
            $this->_em->remove($spot);

            $spotToVersion = $this->_spotVersionRepository->findBy(array('spotId' => $id));

            foreach($spotToVersion as $stvRow) {
                $this->_em->remove($stvRow);
            }

            $editorToSpot = $this->_editorToSpotRepository->findBy(array('spotId' => $id));

            foreach($editorToSpot as $etsRow) {
                $this->_em->remove($etsRow);
            }

            $this->_em->flush();

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

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

}
