alter table "public"."order_items"
add column "variant_id" uuid references "public"."product_variants" ("id");
