// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "gmx-contracts/contracts/core/Vault.sol";
import "gmx-contracts/contracts/core/Router.sol";
import "gmx-contracts/contracts/core/interfaces/IVault.sol";
import "gmx-contracts/contracts/core/interfaces/IVaultPriceFeed.sol";
import "gmx-contracts/contracts/core/interfaces/IVaultUtils.sol";
import "gmx-contracts/contracts/peripherals/Reader.sol";
import "gmx-contracts/contracts/core/PositionRouter.sol";
import "gmx-contracts/contracts/core/PositionManager.sol";
import "hardhat/console.sol";

// change to arbitrum
contract GMX_STRUCTS {
    address gmx_vault_address = 0x489ee077994B6658eAfA855C308275EAd8097C4A;
    address payable gmx_router_address =
        0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064;
    address gmx_reader_address = 0x22199a49A999c351eF7927602CFB187ec3cae489;
    address mc_vault_address = 0xDfbA8AD57d2c62F61F0a60B2C508bCdeb182f855;
    address payable mc_router_address =
        0x3cd2F02B9e39ccC781d0C07fc0286F654e53A76D;
    address mc_reader_address = 0x77AE0F7128C6AC9f0efdb8A6F0Aabd5b979Ea80e;
    address payable gmx_manager_address =
        0x87a4088Bd721F83b6c2E5102e2FA47022Cb1c831;
    address payable gmx_pm_address = 0x3D6bA331e3D9702C5e8A8d254e5d8a285F223aba;
    address payable mc_manager_address =
        0x87a4088Bd721F83b6c2E5102e2FA47022Cb1c831;
    address payable mc_pm_address = 0x3D6bA331e3D9702C5e8A8d254e5d8a285F223aba;
    // GMX
    Vault private gmx_vault = Vault(gmx_vault_address);
    Router private gmx_router = Router(gmx_router_address);
    Reader private gmx_reader = Reader(gmx_reader_address);
    address public gmx_priceFeedAddress = gmx_vault.priceFeed();
    IVaultPriceFeed gmx_vaultPrices = IVaultPriceFeed(gmx_priceFeedAddress);
    PositionManager private gmx_manager = PositionManager(gmx_manager_address);
    PositionRouter private gmx_position_router = PositionRouter(gmx_pm_address);
    // MC
    Vault private mc_vault = Vault(mc_vault_address);
    Router private mc_router = Router(mc_router_address);
    Reader private mc_reader = Reader(mc_reader_address);
    address public mc_priceFeedAddress = mc_vault.priceFeed();
    IVaultPriceFeed mc_vaultPrices = IVaultPriceFeed(mc_priceFeedAddress);
    PositionManager private mc_manager = PositionManager(mc_manager_address);
    PositionRouter private mc_position_router = PositionRouter(mc_pm_address);

    struct EXCHANGE {
        string name;
        Vault vault;
        Router router;
        Reader reader;
        IVaultPriceFeed vaultPrices;

    }

    EXCHANGE[] public exchanges;

    EXCHANGE gmx =
        EXCHANGE({
            name: "GMX",
            vault: gmx_vault,
            router: gmx_router,
            reader: gmx_reader,
            vaultPrices: gmx_vaultPrices

        });

    EXCHANGE mc =
        EXCHANGE({
            name: "MC",
            vault: mc_vault,
            router: mc_router,
            reader: mc_reader,
            vaultPrices: mc_vaultPrices

        });

    constructor() public {
        addExchange();
    }

    function addExchange() internal {
        exchanges.push(gmx);
        exchanges.push(mc);
    }

    function seeExchangeDetails(uint id) public view returns (EXCHANGE memory) {
        return exchanges[id];
    }

    // function registerExchange(
    //     string memory _name,
    //     Vault _vault,
    //     Router _router,
    //     Reader _reader,
    //     IVaultPriceFeed _vaultPrice,
    //     PositionManager _manager,
    //     PositionRouter _position_router
    // ) external {
    //     exchanges.push(
    //         EXCHANGE({
    //             name: _name,
    //             vault: _vault,
    //             router: _router,
    //             reader: _reader,
    //             vaultPrices: _vaultPrice,
    //             PositionManager: _manager,
    //             PositionRouter: _position_router
    //         })
    //     );
    // }
}
// create struct func
