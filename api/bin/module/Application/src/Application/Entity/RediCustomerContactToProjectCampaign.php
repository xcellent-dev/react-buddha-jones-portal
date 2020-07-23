<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediCustomerContactToProjectCampaign
 *
 * @ORM\Table(name="redi_customer_contact_to_project_campaign")
 * @ORM\Entity
 */
class RediCustomerContactToProjectCampaign
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="bigint", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\Column(name="customer_contact_id", type="integer", nullable=true)
     */
    private $customerContactId;

    /**
     * @var integer
     *
     * @ORM\Column(name="project_to_campaign_id", type="integer", nullable=true)
     */
    private $projectToCampaignId;



    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set customerContactId
     *
     * @param integer $customerContactId
     * @return RediCustomerContactToProjectCampaign
     */
    public function setCustomerContactId($customerContactId)
    {
        $this->customerContactId = $customerContactId;

        return $this;
    }

    /**
     * Get customerContactId
     *
     * @return integer 
     */
    public function getCustomerContactId()
    {
        return $this->customerContactId;
    }

    /**
     * Set projectToCampaignId
     *
     * @param integer $projectToCampaignId
     * @return RediCustomerContactToProjectCampaign
     */
    public function setProjectToCampaignId($projectToCampaignId)
    {
        $this->projectToCampaignId = $projectToCampaignId;

        return $this;
    }

    /**
     * Get projectToCampaignId
     *
     * @return integer 
     */
    public function getProjectToCampaignId()
    {
        return $this->projectToCampaignId;
    }
}
