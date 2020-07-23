<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediSpotSent
 *
 * @ORM\Table(name="redi_spot_sent")
 * @ORM\Entity
 */
class RediSpotSent
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
     * @ORM\Column(name="work_type_id", type="integer", nullable=true)
     */
    private $workTypeId;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="datetime", nullable=true)
     */
    private $date;

    /**
     * @var integer
     *
     * @ORM\Column(name="sent_via_method_id", type="integer", nullable=true)
     */
    private $sentViaMethodId;

    /**
     * @var string
     *
     * @ORM\Column(name="notes", type="text", nullable=true)
     */
    private $notes;

    /**
     * @var integer
     *
     * @ORM\Column(name="status_id", type="integer", nullable=true)
     */
    private $statusId;

    /**
     * @var integer
     *
     * @ORM\Column(name="final", type="smallint", nullable=true)
     */
    private $final;



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
     * Set workTypeId
     *
     * @param integer $workTypeId
     * @return RediSpotSent
     */
    public function setWorkTypeId($workTypeId)
    {
        $this->workTypeId = $workTypeId;

        return $this;
    }

    /**
     * Get workTypeId
     *
     * @return integer 
     */
    public function getWorkTypeId()
    {
        return $this->workTypeId;
    }

    /**
     * Set date
     *
     * @param \DateTime $date
     * @return RediSpotSent
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date
     *
     * @return \DateTime 
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set sentViaMethodId
     *
     * @param integer $sentViaMethodId
     * @return RediSpotSent
     */
    public function setSentViaMethodId($sentViaMethodId)
    {
        $this->sentViaMethodId = $sentViaMethodId;

        return $this;
    }

    /**
     * Get sentViaMethodId
     *
     * @return integer 
     */
    public function getSentViaMethodId()
    {
        return $this->sentViaMethodId;
    }

    /**
     * Set notes
     *
     * @param string $notes
     * @return RediSpotSent
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
     * @return RediSpotSent
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
     * Set final
     *
     * @param integer $final
     * @return RediSpotSent
     */
    public function setFinal($final)
    {
        $this->final = $final;

        return $this;
    }

    /**
     * Get final
     *
     * @return integer 
     */
    public function getFinal()
    {
        return $this->final;
    }
}
