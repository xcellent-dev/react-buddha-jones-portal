<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediVersion
 *
 * @ORM\Table(name="redi_version")
 * @ORM\Entity
 */
class RediVersion
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
     * @ORM\Column(name="version_name", type="string", length=100, nullable=true)
     */
    private $versionName;



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
     * Set versionName
     *
     * @param string $versionName
     * @return RediVersion
     */
    public function setVersionName($versionName)
    {
        $this->versionName = $versionName;

        return $this;
    }

    /**
     * Get versionName
     *
     * @return string 
     */
    public function getVersionName()
    {
        return $this->versionName;
    }
}
