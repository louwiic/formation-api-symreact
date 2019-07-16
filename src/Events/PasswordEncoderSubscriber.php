<?php
 namespace App\Events;

use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use App\Entity\Utilisateur;

/**
 * Gestion des événements
 * Dans le cycle de vie des requetes http
 */
class PasswordEncoderSubscriber implements EventSubscriberInterface{

    /**
     * 
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    /**
     * Intervient avant que doctrine persist le mot de passe créé
     * permet de hasher le mot de passe avant insertion
     * Voir la doc api platforme & symonfy pour les kernelevents 
     * 
     * C'est un suscriber à un événement ici à la pré-écriture en bdd
     *
     * @return void
     */
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
        ];
    }

    public function encodePassword(GetResponseForControllerResultEvent $event ){
        
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($user instanceof Utilisateur && $method === "POST"){
            $hash = $this->encoder->encodePassword($user, $user->getPassword());
            $user->setPassword($hash);
        }
    }
}