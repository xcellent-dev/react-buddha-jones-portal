<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediUser
 *
 * @ORM\Table(name="redi_user")
 * @ORM\Entity
 */
class RediUser
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
     * @ORM\Column(name="username", type="string", length=100, nullable=true)
     */
    private $username;

    /**
     * @var string
     *
     * @ORM\Column(name="password", type="string", length=40, nullable=true)
     */
    private $password;

    /**
     * @var string
     *
     * @ORM\Column(name="email", type="string", length=100, nullable=true)
     */
    private $email;

    /**
     * @var string
     *
     * @ORM\Column(name="first_name", type="string", length=100, nullable=true)
     */
    private $firstName;

    /**
     * @var string
     *
     * @ORM\Column(name="last_name", type="string", length=100, nullable=true)
     */
    private $lastName;

    /**
     * @var string
     *
     * @ORM\Column(name="initials", type="string", length=20, nullable=true)
     */
    private $initials;

    /**
     * @var string
     *
     * @ORM\Column(name="image", type="string", length=200, nullable=true)
     */
    private $image;

    /**
     * @var integer
     *
     * @ORM\Column(name="type_id", type="integer", nullable=true)
     */
    private $typeId;

    /**
     * @var string
     *
     * @ORM\Column(name="token", type="string", length=100, nullable=true)
     */
    private $token;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="token_created", type="datetime", nullable=true)
     */
    private $tokenCreated;

    /**
     * @var string
     *
     * @ORM\Column(name="reset_token", type="string", length=100, nullable=true)
     */
    private $resetToken;

    /**
     * @var string
     *
     * @ORM\Column(name="hourly_rate", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $hourlyRate;

    /**
     * @var string
     *
     * @ORM\Column(name="salary_type", type="string", length=1, nullable=true)
     */
    private $salaryType;

    /**
     * @var string
     *
     * @ORM\Column(name="salary_amount", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $salaryAmount;

    /**
     * @var integer
     *
     * @ORM\Column(name="min_hour", type="integer", nullable=true)
     */
    private $minHour;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="last_login_date", type="datetime", nullable=true)
     */
    private $lastLoginDate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_date", type="datetime", nullable=true)
     */
    private $createdDate;

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
     * Set username
     *
     * @param string $username
     * @return RediUser
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get username
     *
     * @return string 
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Set password
     *
     * @param string $password
     * @return RediUser
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Get password
     *
     * @return string 
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Set email
     *
     * @param string $email
     * @return RediUser
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string 
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set firstName
     *
     * @param string $firstName
     * @return RediUser
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;

        return $this;
    }

    /**
     * Get firstName
     *
     * @return string 
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * Set lastName
     *
     * @param string $lastName
     * @return RediUser
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * Get lastName
     *
     * @return string 
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * Set initials
     *
     * @param string $initials
     * @return RediUser
     */
    public function setInitials($initials)
    {
        $this->initials = $initials;

        return $this;
    }

    /**
     * Get initials
     *
     * @return string 
     */
    public function getInitials()
    {
        return $this->initials;
    }

    /**
     * Set image
     *
     * @param string $image
     * @return RediUser
     */
    public function setImage($image)
    {
        $this->image = $image;

        return $this;
    }

    /**
     * Get image
     *
     * @return string 
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set typeId
     *
     * @param integer $typeId
     * @return RediUser
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
     * Set token
     *
     * @param string $token
     * @return RediUser
     */
    public function setToken($token)
    {
        $this->token = $token;

        return $this;
    }

    /**
     * Get token
     *
     * @return string 
     */
    public function getToken()
    {
        return $this->token;
    }

    /**
     * Set tokenCreated
     *
     * @param \DateTime $tokenCreated
     * @return RediUser
     */
    public function setTokenCreated($tokenCreated)
    {
        $this->tokenCreated = $tokenCreated;

        return $this;
    }

    /**
     * Get tokenCreated
     *
     * @return \DateTime 
     */
    public function getTokenCreated()
    {
        return $this->tokenCreated;
    }

    /**
     * Set resetToken
     *
     * @param string $resetToken
     * @return RediUser
     */
    public function setResetToken($resetToken)
    {
        $this->resetToken = $resetToken;

        return $this;
    }

    /**
     * Get resetToken
     *
     * @return string 
     */
    public function getResetToken()
    {
        return $this->resetToken;
    }

    /**
     * Set hourlyRate
     *
     * @param string $hourlyRate
     * @return RediUser
     */
    public function setHourlyRate($hourlyRate)
    {
        $this->hourlyRate = $hourlyRate;

        return $this;
    }

    /**
     * Get hourlyRate
     *
     * @return string 
     */
    public function getHourlyRate()
    {
        return $this->hourlyRate;
    }

    /**
     * Set salaryType
     *
     * @param string $salaryType
     * @return RediUser
     */
    public function setSalaryType($salaryType)
    {
        $this->salaryType = $salaryType;

        return $this;
    }

    /**
     * Get salaryType
     *
     * @return string 
     */
    public function getSalaryType()
    {
        return $this->salaryType;
    }

    /**
     * Set salaryAmount
     *
     * @param string $salaryAmount
     * @return RediUser
     */
    public function setSalaryAmount($salaryAmount)
    {
        $this->salaryAmount = $salaryAmount;

        return $this;
    }

    /**
     * Get salaryAmount
     *
     * @return string 
     */
    public function getSalaryAmount()
    {
        return $this->salaryAmount;
    }

    /**
     * Set minHour
     *
     * @param integer $minHour
     * @return RediUser
     */
    public function setMinHour($minHour)
    {
        $this->minHour = $minHour;

        return $this;
    }

    /**
     * Get minHour
     *
     * @return integer 
     */
    public function getMinHour()
    {
        return $this->minHour;
    }

    /**
     * Set lastLoginDate
     *
     * @param \DateTime $lastLoginDate
     * @return RediUser
     */
    public function setLastLoginDate($lastLoginDate)
    {
        $this->lastLoginDate = $lastLoginDate;

        return $this;
    }

    /**
     * Get lastLoginDate
     *
     * @return \DateTime 
     */
    public function getLastLoginDate()
    {
        return $this->lastLoginDate;
    }

    /**
     * Set createdDate
     *
     * @param \DateTime $createdDate
     * @return RediUser
     */
    public function setCreatedDate($createdDate)
    {
        $this->createdDate = $createdDate;

        return $this;
    }

    /**
     * Get createdDate
     *
     * @return \DateTime 
     */
    public function getCreatedDate()
    {
        return $this->createdDate;
    }

    /**
     * Set status
     *
     * @param integer $status
     * @return RediUser
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
