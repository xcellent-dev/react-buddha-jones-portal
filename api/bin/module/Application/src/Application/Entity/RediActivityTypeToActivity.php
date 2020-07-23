<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediActivityTypeToActivity
 *
 * @ORM\Table(name="redi_activity_type_to_activity")
 * @ORM\Entity
 */
class RediActivityTypeToActivity
{
    /**
     * @var integer
     *
     * @ORM\Column(name="activity_type_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $activityTypeId;

    /**
     * @var integer
     *
     * @ORM\Column(name="activity_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $activityId;



    /**
     * Set activityTypeId
     *
     * @param integer $activityTypeId
     * @return RediActivityTypeToActivity
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
     * Set activityId
     *
     * @param integer $activityId
     * @return RediActivityTypeToActivity
     */
    public function setActivityId($activityId)
    {
        $this->activityId = $activityId;

        return $this;
    }

    /**
     * Get activityId
     *
     * @return integer 
     */
    public function getActivityId()
    {
        return $this->activityId;
    }
}
