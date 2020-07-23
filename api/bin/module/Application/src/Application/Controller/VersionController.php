<?php

namespace Application\Controller;

use Application\Entity\RediProjectHistory;
use Application\Entity\RediSpotVersion;
use Application\Entity\RediVersion;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class VersionController extends CustomAbstractActionController
{
    public function getList()
    {
        $search = trim($this->getRequest()->getQuery('search', ''));
        $offset = (int)trim($this->getRequest()->getQuery('offset', 0));
        $length = (int)trim($this->getRequest()->getQuery('length', 10));
        $spotId = (int)trim($this->getRequest()->getQuery('spot_id', 0));

        if ($spotId) {
            $data = $this->_versionRepo->searchWithSpot($search, $spotId, $offset, $length);
            $totalCount = $this->_versionRepo->searchCountWithSpot($search, $spotId);
        } else {
            $data = $this->_versionRepo->search($search, $offset, $length);
            $totalCount = $this->_versionRepo->searchCount($search);
        }

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'total_count' => $totalCount,
            'object_count' => count($data),
            'data' => $data
        );


        return new JsonModel($response);
    }

    public function create($data)
    {
        $name = trim(isset($data['name']) ? $data['name'] : '');
        $billType = isset($data['billing_type']) ? $data['billing_type'] : null;

        $spotId = isset($data['spot_id']) ? $data['spot_id'] : null;

        $spotId = (array)json_decode($spotId, true);

        if ($name) {
            $version = new RediVersion();
            $version->setVersionName($name);
            $this->_em->persist($version);
            $this->_em->flush();

            $versionId = $version->getId();

            foreach ($spotId as $sId) {
                $spot = $this->_spotRepository->find($sId);

                if ($spot) {
                    $spotVersion = new RediSpotVersion();
                    $spotVersion->setSpotId($sId);
                    $spotVersion->setVersionId($versionId);
                    $spotVersion->setBillingType($billType);

                    $this->_em->persist($spotVersion);

                    // project history
                    $campaign = $this->_campaignRepository->find($spot->getCampaignId());
                    $historyMessage = 'Version "' . $name . '" was added to spot"' . $spot->getSpotName() . '" from "' . $campaign->getCampaignName() . '" campaign';
                    $projectHistory = new RediProjectHistory();
                    $projectHistory->setProjectId($spot->getProjectId());
                    $projectHistory->setUserId($this->_user_id);
                    $projectHistory->setMessage($historyMessage);
                    $projectHistory->setCreatedAt(new \DateTime('now'));
                    $this->_em->persist($projectHistory);
                }
            }

            $this->_em->flush();

            $response = array(
                'status' => 1,
                'message' => 'Request successful.',
                'data' => array(
                    'version_id' => $versionId
                ),
            );

        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data(name).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }


}
