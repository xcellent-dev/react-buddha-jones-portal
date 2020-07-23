<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediTimeEntry
 *
 * @ORM\Table(name="redi_time_entry")
 * @ORM\Entity
 */
class RediTimeEntry
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
     * @ORM\Column(name="user_id", type="integer", nullable=true)
     */
    private $userId;

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
     * @ORM\Column(name="version_id", type="integer", nullable=true)
     */
    private $versionId;

    /**
     * @var integer
     *
     * @ORM\Column(name="spot_id", type="integer", nullable=true)
     */
    private $spotId;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="start_date", type="datetime", nullable=true)
     */
    private $startDate;

    /**
     * @var string
     *
     * @ORM\Column(name="duration", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $duration;

    /**
     * @var integer
     *
     * @ORM\Column(name="activity_type_id", type="integer", nullable=true)
     */
    private $activityTypeId;

    /**
     * @var string
     *
     * @ORM\Column(name="activity_description", type="text", nullable=true)
     */
    private $activityDescription;

    /**
     * @var string
     *
     * @ORM\Column(name="notes", type="text", nullable=true)
     */
    private $notes;

    /**
     * @var integer
     *
     * @ORM\Column(name="non_billable", type="smallint", nullable=true)
     */
    private $nonBillable;

    /**
     * @var integer
     *
     * @ORM\Column(name="created_by", type="integer", nullable=true)
     */
    private $createdBy;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=true)
     */
    private $createdAt;

    /**
     * @var integer
     *
     * @ORM\Column(name="status", type="integer", nullable=true)
     */
    private $status;



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
     * Set userId
     *
     * @param integer $userId
     * @return RediTimeEntry
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;

        return $this;
    }

    /**
     * Get userId
     *
     * @return integer 
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * Set projectId
     *
     * @param integer $projectId
     * @return RediTimeEntry
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
     * @return RediTimeEntry
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
     * Set versionId
     *
     * @param integer $versionId
     * @return RediTimeEntry
     */
    public function setVersionId($versionId)
    {
        $this->versionId = $versionId;

        return $this;
    }

    /**
     * Get versionId
     *
     * @return integer 
     */
    public function getVersionId()
    {
        return $this->versionId;
    }

    /**
     * Set spotId
     *
     * @param integer $spotId
     * @return RediTimeEntry
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
     * Set startDate
     *
     * @param \DateTime $startDate
     * @return RediTimeEntry
     */
    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;

        return $this;
    }

    /**
     * Get startDate
     *
     * @return \DateTime 
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    /**
     * Set duration
     *
     * @param string $duration
     * @return RediTimeEntry
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;

        return $this;
    }

    /**
     * Get duration
     *
     * @return string 
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Set activityTypeId
     *
     * @param integer $activityTypeId
     * @return RediTimeEntry
     */
    public function setActivityTypeId($activityTypeId)
    {
        $this->activityTypeId = $activityTypeId;

        return $this;
    }

    /**
     * Get activityTypeId
     *
     * @return integer 
     */
    public function getActivityTypeId()
    {
        return $this->activityTypeId;
    }

    /**
     * Set activityDescription
     *
     * @param string $activityDescription
     * @return RediTimeEntry
     */
    public function setActivityDescription($activityDescription)
    {
        $this->activityDescription = $activityDescription;

        return $this;
    }

    /**
     * Get activityDescription
     *
     * @return string 
     */
    public function getActivityDescription()
    {
        return $this->activityDescription;
    }

    /**
     * Set notes
     *
     * @param string $notes
     * @return RediTimeEntry
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
     * Set nonBillable
     *
     * @param integer $nonBillable
     * @return RediTimeEntry
     */
    public function setNonBillable($nonBillable)
    {
        $this->nonBillable = $nonBillable;

        return $this;
    }

    /**
     * Get nonBillable
     *
     * @return integer 
     */
    public function getNonBillable()
    {
        return $this->nonBillable;
    }

    /**
     * Set createdBy
     *
     * @param integer $createdBy
     * @return RediTimeEntry
     */
    public function setCreatedBy($createdBy)
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    /**
     * Get createdBy
     *
     * @return integer 
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return RediTimeEntry
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

    /**
     * Set status
     *
     * @param integer $status
     * @return RediTimeEntry
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return integer 
     */
    public function getStatus()
    {
        return $this->status;
    }
}
