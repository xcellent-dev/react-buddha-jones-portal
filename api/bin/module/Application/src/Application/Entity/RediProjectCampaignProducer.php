<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediProjectCampaignProducer
 *
 * @ORM\Table(name="redi_project_campaign_producer")
 * @ORM\Entity
 */
class RediProjectCampaignProducer
{
    /**
     * @var integer
     *
     * @ORM\Column(name="project_campaign_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $projectCampaignId;

    /**
     * @var integer
     *
     * @ORM\Column(name="producer_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $producerId;



    /**
     * Set projectCampaignId
     *
     * @param integer $projectCampaignId
     * @return RediProjectCampaignProducer
     */
    public function setProjectCampaignId($projectCampaignId)
    {
        $this->projectCampaignId = $projectCampaignId;

        return $this;
    }

    /**
     * Get projectCampaignId
     *
     * @return integer 
     */
    public function getProjectCampaignId()
    {
        return $this->projectCampaignId;
    }

    /**
     * Set producerId
     *
     * @param integer $producerId
     * @return RediProjectCampaignProducer
     */
    public function setProducerId($producerId)
    {
        $this->producerId = $producerId;

        return $this;
    }

    /**
     * Get producerId
     *
     * @return integer 
     */
    public function getProducerId()
    {
        return $this->producerId;
    }
}
