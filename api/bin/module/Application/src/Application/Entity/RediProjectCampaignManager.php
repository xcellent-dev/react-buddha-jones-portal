<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediProjectCampaignManager
 *
 * @ORM\Table(name="redi_project_campaign_manager")
 * @ORM\Entity
 */
class RediProjectCampaignManager
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
     * @ORM\Column(name="manager_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $managerId;



    /**
     * Set projectCampaignId
     *
     * @param integer $projectCampaignId
     * @return RediProjectCampaignManager
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
     * Set managerId
     *
     * @param integer $managerId
     * @return RediProjectCampaignManager
     */
    public function setManagerId($managerId)
    {
        $this->managerId = $managerId;

        return $this;
    }

    /**
     * Get managerId
     *
     * @return integer 
     */
    public function getManagerId()
    {
        return $this->managerId;
    }
}
