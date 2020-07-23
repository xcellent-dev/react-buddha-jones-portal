<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediActivityType
 *
 * @ORM\Table(name="redi_activity_type")
 * @ORM\Entity
 */
class RediActivityType
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="activity_type", type="string", length=100, nullable=true)
     */
    private $activityType;



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
     * Set activityType
     *
     * @param string $activityType
     * @return RediActivityType
     */
    public function setActivityType($activityType)
    {
        $this->activityType = $activityType;

        return $this;
    }

    /**
     * Get activityType
     *
     * @return string 
     */
    public function getActivityType()
    {
        return $this->activityType;
    }
}
