<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediEstimate
 *
 * @ORM\Table(name="redi_estimate")
 * @ORM\Entity
 */
class RediEstimate
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
     * @ORM\Column(name="spot_id", type="integer", nullable=true)
     */
    private $spotId;

    /**
     * @var integer
     *
     * @ORM\Column(name="version_id", type="integer", nullable=true)
     */
    private $versionId;

    /**
     * @var integer
     *
     * @ORM\Column(name="multiplier", type="integer", nullable=true)
     */
    private $multiplier;

    /**
     * @var string
     *
     * @ORM\Column(name="notes", type="text", nullable=true)
     */
    private $notes;

    /**
     * @var integer
     *
     * @ORM\Column(name="submitted_to", type="integer", nullable=true)
     */
    private $submittedTo;

    /**
     * @var integer
     *
     * @ORM\Column(name="type_id", type="integer", nullable=true)
     */
    private $typeId;

    /**
     * @var integer
     *
     * @ORM\Column(name="status_id", type="integer", nullable=true)
     */
    private $statusId;

    /**
     * @var string
     *
     * @ORM\Column(name="time_unit", type="string", length=1, nullable=true)
     */
    private $timeUnit;

    /**
     * @var string
     *
     * @ORM\Column(name="total_amount", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $totalAmount;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=true)
     */
    private $createdAt;

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
     * Set spotId
     *
     * @param integer $spotId
     * @return RediEstimate
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
     * Set versionId
     *
     * @param integer $versionId
     * @return RediEstimate
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
     * Set multiplier
     *
     * @param integer $multiplier
     * @return RediEstimate
     */
    public function setMultiplier($multiplier)
    {
        $this->multiplier = $multiplier;

        return $this;
    }

    /**
     * Get multiplier
     *
     * @return integer 
     */
    public function getMultiplier()
    {
        return $this->multiplier;
    }

    /**
     * Set notes
     *
     * @param string $notes
     * @return RediEstimate
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
     * Set submittedTo
     *
     * @param integer $submittedTo
     * @return RediEstimate
     */
    public function setSubmittedTo($submittedTo)
    {
        $this->submittedTo = $submittedTo;

        return $this;
    }

    /**
     * Get submittedTo
     *
     * @return integer 
     */
    public function getSubmittedTo()
    {
        return $this->submittedTo;
    }

    /**
     * Set typeId
     *
     * @param integer $typeId
     * @return RediEstimate
     */
    public function setTypeId($typeId)
    {
        $this->typeId = $typeId;

        return $this;
    }

    /**
     * Get typeId
     *
     * @return integer 
     */
    public function getTypeId()
    {
        return $this->typeId;
    }

    /**
     * Set statusId
     *
     * @param integer $statusId
     * @return RediEstimate
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
     * Set timeUnit
     *
     * @param string $timeUnit
     * @return RediEstimate
     */
    public function setTimeUnit($timeUnit)
    {
        $this->timeUnit = $timeUnit;

        return $this;
    }

    /**
     * Get timeUnit
     *
     * @return string 
     */
    public function getTimeUnit()
    {
        return $this->timeUnit;
    }

    /**
     * Set totalAmount
     *
     * @param string $totalAmount
     * @return RediEstimate
     */
    public function setTotalAmount($totalAmount)
    {
        $this->totalAmount = $totalAmount;

        return $this;
    }

    /**
     * Get totalAmount
     *
     * @return string 
     */
    public function getTotalAmount()
    {
        return $this->totalAmount;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return RediEstimate
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
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     * @return RediEstimate
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
