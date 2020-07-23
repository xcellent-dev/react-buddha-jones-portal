<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediActivity
 *
 * @ORM\Table(name="redi_activity")
 * @ORM\Entity
 */
class RediActivity
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
     * @ORM\Column(name="name", type="string", length=200, nullable=true)
     */
    private $name;

    /**
     * @var integer
     *
     * @ORM\Column(name="type_id", type="integer", nullable=true)
     */
    private $typeId;

    /**
     * @var integer
     *
     * @ORM\Column(name="user_type_id", type="integer", nullable=true)
     */
    private $userTypeId;

    /**
     * @var integer
     *
     * @ORM\Column(name="status", type="smallint", nullable=true)
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
     * Set name
     *
     * @param string $name
     * @return RediActivity
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set typeId
     *
     * @param integer $typeId
     * @return RediActivity
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
     * Set userTypeId
     *
     * @param integer $userTypeId
     * @return RediActivity
     */
    public function setUserTypeId($userTypeId)
    {
        $this->userTypeId = $userTypeId;

        return $this;
    }

    /**
     * Get userTypeId
     *
     * @return integer 
     */
    public function getUserTypeId()
    {
        return $this->userTypeId;
    }

    /**
     * Set status
     *
     * @param integer $status
     * @return RediActivity
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
