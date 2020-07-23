<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ApiLog
 *
 * @ORM\Table(name="api_log")
 * @ORM\Entity
 */
class ApiLog
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
     * @var string
     *
     * @ORM\Column(name="api", type="string", length=200, nullable=true)
     */
    private $api;

    /**
     * @var string
     *
     * @ORM\Column(name="post_data", type="text", nullable=true)
     */
    private $postData;

    /**
     * @var string
     *
     * @ORM\Column(name="get_data", type="text", nullable=true)
     */
    private $getData;

    /**
     * @var string
     *
     * @ORM\Column(name="response", type="text", nullable=true)
     */
    private $response;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_created", type="datetime", nullable=true)
     */
    private $dateCreated;



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
     * Set api
     *
     * @param string $api
     * @return ApiLog
     */
    public function setApi($api)
    {
        $this->api = $api;

        return $this;
    }

    /**
     * Get api
     *
     * @return string 
     */
    public function getApi()
    {
        return $this->api;
    }

    /**
     * Set postData
     *
     * @param string $postData
     * @return ApiLog
     */
    public function setPostData($postData)
    {
        $this->postData = $postData;

        return $this;
    }

    /**
     * Get postData
     *
     * @return string 
     */
    public function getPostData()
    {
        return $this->postData;
    }

    /**
     * Set getData
     *
     * @param string $getData
     * @return ApiLog
     */
    public function setGetData($getData)
    {
        $this->getData = $getData;

        return $this;
    }

    /**
     * Get getData
     *
     * @return string 
     */
    public function getGetData()
    {
        return $this->getData;
    }

    /**
     * Set response
     *
     * @param string $response
     * @return ApiLog
     */
    public function setResponse($response)
    {
        $this->response = $response;

        return $this;
    }

    /**
     * Get response
     *
     * @return string 
     */
    public function getResponse()
    {
        return $this->response;
    }

    /**
     * Set dateCreated
     *
     * @param \DateTime $dateCreated
     * @return ApiLog
     */
    public function setDateCreated($dateCreated)
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }

    /**
     * Get dateCreated
     *
     * @return \DateTime 
     */
    public function getDateCreated()
    {
        return $this->dateCreated;
    }
}
