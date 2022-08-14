const express = require("express");
const router = express.Router({mergeParams: true});
const {
    getPermissions,
    getPermission,
    createPermission,
    updatePermission,
    deletePermission
} = require("../controllers/permissions");
const {
    guardPermission,
    restrict,
    authenticate,
} = require("../middleware/auth");

router.use(authenticate);

router.route("/")
.get(
    guardPermission("readonly","modify","admin"),
    getPermissions
)
.post(
    restrict,
    createPermission
);


router.route("/:permissionid")
.get(
    guardPermission("readonly","modify","admin"),
    getPermission
)
.put(
    guardPermission("admin"),
    updatePermission
)
.delete(
    restrict,
    deletePermission
);



module.exports = router;