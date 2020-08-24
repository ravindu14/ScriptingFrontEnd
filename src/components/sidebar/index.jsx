import React from "react";

import SubMenu from "components/subMenu";

import "./styles.scss";

export default function sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <img alt="logo" src={require("assets/image/buyport-logo.svg")} />
      </div>
      <div className="menu">
        <SubMenu title="Dashboard" icon="dashboard" onClick="/" />
        <SubMenu
          title="Purchases"
          icon="purchases"
          categories={[
            {
              category: "Purchase Orders",
              subItems: [
                { title: "Add Purchase", link: "/purchases/create" },
                { title: "View Purchases", link: "/purchases" },
                { title: "Receipt Purchases", link: "/purchases/receipt" }
              ]
            },
            {
              category: "Supplier Return",
              subItems: [
                {
                  title: "Add Supplier Return",
                  link: "/supplierReturn/create"
                },
                { title: "View Supplier Return", link: "/supplierReturn" }
              ]
            }
          ]}
        />
        <SubMenu
          title="Inventory"
          icon="inventory"
          categories={[
            {
              category: "Products",
              subItems: [
                { title: "Add Products", link: "/products/create" },
                { title: "View Products", link: "/products" },
                { title: "Markup Price Update", link: "/product/priceUpdate" }
              ]
            },
            {
              category: "Transactions",
              subItems: [
                { title: "Stock Adjustment", link: "/stockAdjustments" },
                { title: "Warehouse Transfers", link: "/warehouseTransfers" },
                { title: "Stock Counts", link: "/stockCounts" }
              ]
            }
          ]}
        />
        <SubMenu
          title="Sales"
          icon="sales"
          categories={[
            {
              category: "Orders",
              subItems: [
                { title: "Add Sales Order", link: "/sales/create" },
                { title: "View Sales Orders", link: "/sales" }
              ]
            },
            {
              category: "Credits",
              subItems: [
                { title: "Add Credit", link: "/credit/addCredit" },
                { title: "View Credits", link: "/viewCredit" }
              ]
            }
          ]}
        />
        <SubMenu
          title="Customers"
          icon="customers"
          items={[
            { title: "Add Customers", link: "/customers/create" },
            { title: "View Customers", link: "/customers" },
            { title: "Import/Export", link: "/customers/importExport" }
          ]}
        />
        <SubMenu
          title="Suppliers"
          icon="suppliers"
          items={[
            { title: "Add Supplier", link: "/suppliers/create" },
            { title: "View Suppliers", link: "/suppliers" }
          ]}
        />
        <SubMenu
          title="Settings"
          icon="settings"
          categories={[
            {
              category: "Organization",
              subItems: [{ title: "Company", link: "/settings/company" }]
            },
            {
              category: "Security",
              subItems: [
                { title: "Users", link: "/settings/users" },
                { title: "Roles", link: "/settings/roles" },
                {
                  title: "Role Permissions",
                  link: "/settings/rolePermissions"
                }
              ]
            },
            {
              category: "System",
              subItems: [
                {
                  title: "Adjustment Reasons",
                  link: "/settings/adjustmentReasons"
                },
                {
                  title: "Attribute Sets",
                  link: "/settings/attributeSet/create"
                },
                { title: "Credit Reasons", link: "/settings/creditReasons" },
                { title: "Currency Rates", link: "/settings/currencyRates" },

                { title: "Customer Types", link: "/settings/customerTypes" },
                {
                  title: "Delivery Methods",
                  link: "/settings/deliveryMethods"
                },
                { title: "Payment Terms", link: "/settings/paymentTerms" },
                { title: "Prefixes", link: "/settings/prefixes" },
                { title: "Product Groups", link: "/settings/productGroups" },
                { title: "Sales Groups", link: "/settings/salesGroups" },
                { title: "Sales Persons", link: "/settings/salesPersons" },
                { title: "Sell Price Tiers", link: "/settings/sellPriceTiers" },
                {
                  title: "Shipping Companies",
                  link: "/settings/shippingCompanies"
                },
                {
                  title: "Supplier Return Reasons",
                  link: "/settings/supplierReturnReasons"
                },
                { title: "Taxes", link: "/settings/taxes" },
                { title: "Units of Measure", link: "/settings/unitsOfMeasure" },

                { title: "warehouses", link: "/settings/warehouses" }
              ]
            }
          ]}
        />
      </div>
    </div>
  );
}
