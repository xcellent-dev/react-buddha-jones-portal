<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediBilling
 *
 * @ORM\Table(name="redi_billing")
 * @ORM\Entity
 */
class RediBilling
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
     * @ORM\Column(name="customer_id", type="integer", nullable=true)
     */
    private $customerId;

    /**
     * @var integer
     *
     * @ORM\Column(name="project_id", type="integer", nullable=true)
     */
    private $projectId;

    /**
     * @var integer
     *
     * @ORM\Column(name="campaign_id", type="integer", nullable=true)
     */
    private $campaignId;

    /**
     * @var integer
     *
     * @ORM\Column(name="spot_id", type="integer", nullable=true)
     */
    private $spotId;

    /**
     * @var string
     *
     * @ORM\Column(name="notes", type="text", nullable=true)
     */
    private $notes;

    /**
     * @var integer
     *
     * @ORM\Column(name="status_id", type="smallint", nullable=true)
     */
    private $statusId;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=true)
     */
    private $createdAt;



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
     * Set customerId
     *
     * @param integer $customerId
     * @return RediBilling
     */
    public function setCustomerId($customerId)
    {
        $this->customerId = $customerId;

        return $this;
    }

    /**
     * Get customerId
     *
     * @return integer 
     */
    public function getCustomerId()
    {
        return $this->customerId;
    }

    /**
     * Set projectId
     *
     * @param integer $projectId
     * @return RediBilling
     */
    public function setProjectId($projectId)
    {
        $this->projectId = $projectId;

        return $this;
    }

    /**
     * Get projectId
     *
     * @return integer 
     */
    public function getProjectId()
    {
        return $this->projectId;
    }

    /**
     * Set campaignId
     *
     * @param integer $campaignId
     * @return RediBilling
     */
    public function setCampaignId($campaignId)
    {
        $this->campaignId = $campaignId;

        return $this;
    }

    /**
     * Get campaignId
     *
     * @return integer 
     */
    public function getCampaignId()
    {
        return $this->campaignId;
    }

    /**
     * Set spotId
     *
     * @param integer $spotId
     * @return RediBilling
     */
    public function setSpotId($spotId)
    {
        $this->spotId = $spotId;

        return $this;
    }

    /**
     * Get spotId
     *
     * @return integer 
     */
    public function getSpotId()
    {
        return $this->spotId;
    }

    /**
     * Set notes
     *
     * @param string $notes
     * @return RediBilling
     */
    public function setNotes($notes)
    {
        $this->notes = $notes;

        return $this;
    }

    /**
     * Get notes
     *
     * @return string 
     */
    public function getNotes()
    {
        return $this->notes;
    }

    /**
     * Set statusId
     *
     * @param integer $statusId
     * @return RediBilling
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;

        return $this;
    }

    /**
     * Get statusId
     *
     * @return integer 
     */
    public function getStatusId()
    {
        return $this->statusId;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return RediBilling
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime 
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }
}
