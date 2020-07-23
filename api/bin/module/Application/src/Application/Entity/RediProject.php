<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediProject
 *
 * @ORM\Table(name="redi_project")
 * @ORM\Entity
 */
class RediProject
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
     * @ORM\Column(name="project_name", type="string", length=200, nullable=true)
     */
    private $projectName;

    /**
     * @var integer
     *
     * @ORM\Column(name="customer_id", type="integer", nullable=true)
     */
    private $customerId;

    /**
     * @var integer
     *
     * @ORM\Column(name="first_point_of_contact_id", type="integer", nullable=true)
     */
    private $firstPointOfContactId;

    /**
     * @var string
     *
     * @ORM\Column(name="notes", type="text", nullable=true)
     */
    private $notes;



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
     * Set projectName
     *
     * @param string $projectName
     * @return RediProject
     */
    public function setProjectName($projectName)
    {
        $this->projectName = $projectName;

        return $this;
    }

    /**
     * Get projectName
     *
     * @return string 
     */
    public function getProjectName()
    {
        return $this->projectName;
    }

    /**
     * Set customerId
     *
     * @param integer $customerId
     * @return RediProject
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
     * Set firstPointOfContactId
     *
     * @param integer $firstPointOfContactId
     * @return RediProject
     */
    public function setFirstPointOfContactId($firstPointOfContactId)
    {
        $this->firstPointOfContactId = $firstPointOfContactId;

        return $this;
    }

    /**
     * Get firstPointOfContactId
     *
     * @return integer 
     */
    public function getFirstPointOfContactId()
    {
        return $this->firstPointOfContactId;
    }

    /**
     * Set notes
     *
     * @param string $notes
     * @return RediProject
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
}
