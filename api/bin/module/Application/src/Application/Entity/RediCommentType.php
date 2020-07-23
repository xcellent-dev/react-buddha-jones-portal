<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediCommentType
 *
 * @ORM\Table(name="redi_comment_type")
 * @ORM\Entity
 */
class RediCommentType
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
     * @ORM\Column(name="comment_type", type="string", length=100, nullable=true)
     */
    private $commentType;



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
     * Set commentType
     *
     * @param string $commentType
     * @return RediCommentType
     */
    public function setCommentType($commentType)
    {
        $this->commentType = $commentType;

        return $this;
    }

    /**
     * Get commentType
     *
     * @return string 
     */
    public function getCommentType()
    {
        return $this->commentType;
    }
}
