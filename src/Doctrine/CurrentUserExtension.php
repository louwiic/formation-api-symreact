<?php

namespace App\Doctrine;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\Utilisateur;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;

/**
 * Permet d'intervenir lors d'une requete de doctrine de faire des modifications avant envoi de la requete
 */
class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{

    private $security;
    private $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $checked)
    {
        $this->security = $security;
        $this->auth = $checked;
    }

    private function addWhere(QueryBuilder $queryBuilder, String $resourceClass)
    {
        $user = $this->security->getUser();

        //dd($user);

        if (($resourceClass === Customer::class or $resourceClass === Invoice::class
            &&
            !$this->auth->isGranted("ROLE_ADMIN"))) {
            $rootAlias = $queryBuilder->getRootAliases()[0];

            if ($resourceClass === Customer::class) {
                $queryBuilder->andWhere("$rootAlias.utilisateur = :user");
            } else if ($resourceClass === Invoice::class) {
                $queryBuilder->join("$rootAlias.customer", "c")
                    ->andWhere("c.utilisateur = :user");

            }
            $queryBuilder->setParameter("user", $user);
            //dd($queryBuilder);
        }
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?string $operationName = null)
    {
        $user = $this->security->getUser();
        if($user instanceof Utilisateur){
            $this->addWhere($queryBuilder, $resourceClass);
        }
       
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
        $user = $this->security->getUser();
        if($user instanceof Utilisateur){
            $this->addWhere($queryBuilder, $resourceClass);
        }
       
    }

}
