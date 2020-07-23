<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediSpotSentFile
 *
 * @ORM\Table(name="redi_spot_sent_file")
 * @ORM\Entity
 */
class RediSpotSentFile
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
     * @ORM\Column(name="spot_sent_id", type="bigint", nullable=true)
     */
    private $spotSentId;

    /**
     * @var string
     *
     * @ORM\Column(name="file_name", type="string", length=200, nullable=true)
     */
    private $fileName;

    /**
     * @var string
     *
     * @ORM\Column(name="file_description", type="text", nullable=true)
     */
    private $fileDescription;



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
     * Set spotSentId
     *
     * @param integer $spotSentId
     * @return RediSpotSentFile
     */
    public function setSpotSentId($spotSentId)
    {
        $this->spotSentId = $spotSentId;

        return $this;
    }

    /**
     * Get spotSentId
     *
     * @return integer 
     */
    public function getSpotSentId()
    {
        return $this->spotSentId;
    }

    /**
     * Set fileName
     *
     * @param string $fileName
     * @return RediSpotSentFile
     */
    public function setFileName($fileName)
    {
        $this->fileName = $fileName;

        return $this;
    }

    /**
     * Get fileName
     *
     * @return string 
     */
    public function getFileName()
    {
        return $this->fileName;
    }

    /**
     * Set fileDescription
     *
     * @param string $fileDescription
     * @return RediSpotSentFile
     */
    public function setFileDescription($fileDescription)
    {
        $this->fileDescription = $fileDescription;

        return $this;
    }

    /**
     * Get fileDescription
     *
     * @return string 
     */
    public function getFileDescription()
    {
        return $this->fileDescription;
    }
}
