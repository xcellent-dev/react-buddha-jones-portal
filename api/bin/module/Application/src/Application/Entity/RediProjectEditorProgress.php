<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediProjectEditorProgress
 *
 * @ORM\Table(name="redi_project_editor_progress")
 * @ORM\Entity
 */
class RediProjectEditorProgress
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
     * @ORM\Column(name="watched", type="smallint", nullable=true)
     */
    private $watched;

    /**
     * @var integer
     *
     * @ORM\Column(name="broken_down", type="smallint", nullable=true)
     */
    private $brokenDown;

    /**
     * @var string
     *
     * @ORM\Column(name="due", type="string", length=200, nullable=true)
     */
    private $due;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="due_date", type="date", nullable=true)
     */
    private $dueDate;

    /**
     * @var integer
     *
     * @ORM\Column(name="status_id", type="integer", nullable=true)
     */
    private $statusId;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=true)
     */
    private $updatedAt;



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
     * Set projectId
     *
     * @param integer $projectId
     * @return RediProjectEditorProgress
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
     * @return RediProjectEditorProgress
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
     * @return RediProjectEditorProgress
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
     * @return RediProjectEditorProgress
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
     * Set watched
     *
     * @param integer $watched
     * @return RediProjectEditorProgress
     */
    public function setWatched($watched)
    {
        $this->watched = $watched;

        return $this;
    }

    /**
     * Get watched
     *
     * @return integer 
     */
    public function getWatched()
    {
        return $this->watched;
    }

    /**
     * Set brokenDown
     *
     * @param integer $brokenDown
     * @return RediProjectEditorProgress
     */
    public function setBrokenDown($brokenDown)
    {
        $this->brokenDown = $brokenDown;

        return $this;
    }

    /**
     * Get brokenDown
     *
     * @return integer 
     */
    public function getBrokenDown()
    {
        return $this->brokenDown;
    }

    /**
     * Set due
     *
     * @param string $due
     * @return RediProjectEditorProgress
     */
    public function setDue($due)
    {
        $this->due = $due;

        return $this;
    }

    /**
     * Get due
     *
     * @return string 
     */
    public function getDue()
    {
        return $this->due;
    }

    /**
     * Set dueDate
     *
     * @param \DateTime $dueDate
     * @return RediProjectEditorProgress
     */
    public function setDueDate($dueDate)
    {
        $this->dueDate = $dueDate;

        return $this;
    }

    /**
     * Get dueDate
     *
     * @return \DateTime 
     */
    public function getDueDate()
    {
        return $this->dueDate;
    }

    /**
     * Set statusId
     *
     * @param integer $statusId
     * @return RediProjectEditorProgress
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
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     * @return RediProjectEditorProgress
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime 
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }
}
