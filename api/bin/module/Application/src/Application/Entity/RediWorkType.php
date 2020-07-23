<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediWorkType
 *
 * @ORM\Table(name="redi_work_type")
 * @ORM\Entity
 */
class RediWorkType
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
     * @ORM\Column(name="work_type", type="string", length=100, nullable=true)
     */
    private $workType;



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
     * Set workType
     *
     * @param string $workType
     * @return RediWorkType
     */
    public function setWorkType($workType)
    {
        $this->workType = $workType;

        return $this;
    }

    /**
     * Get workType
     *
     * @return string 
     */
    public function getWorkType()
    {
        return $this->workType;
    }
}
