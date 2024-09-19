const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { generateSignedUrl } = require("./helper/bucketurlgenerator");

const prisma = new PrismaClient();

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const materials = await prisma.materials.findMany({
      include: { video: true, assementId: true, StudentMaterial: true },
    });
    res.json(materials);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleMaterial = await prisma.materials.findUnique({
      where: {
        id: id,
      },
      include: {
        video: true,
        assementId: {
          include: { question: { orderBy: { questionIndex: "asc" } } },
        },
        link: true,
        file: true,
        StudentMaterial: true,
      },
    });

    if (singleMaterial) {
      console.log("Single Material: " + JSON.stringify(singleMaterial));

      if (singleMaterial.video && singleMaterial.video.location) {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "course_videos",
          singleMaterial.video.location
        );
        console.log("print of x: " + signedUrlforFile);
        res.json({ ...singleMaterial, videoUrl: signedUrlforFile });
      } else if (singleMaterial.file && singleMaterial.file.location) {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "common_files",
          singleMaterial.file.location
        );
        console.log("print of x: " + signedUrlforFile);
        res.json({ ...singleMaterial, fileUrl: signedUrlforFile });
      } else {
        res.json({ ...singleMaterial, videoUrl: "" });
      }
    }
    //  res.json(singleMaterial);
  } catch (error) {
    console.log("Error from catch: " + error);
    next(error);
  }
});

router.get("/filtercourse/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const ListMaterials = await prisma.materials.findMany({
      where: {
        coursesId: id,
      },
      orderBy: [
        {
          part: "asc",
        },
        {
          materialIndex: "asc",
        },
      ],
    });
    res.json(ListMaterials);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", async (req, res, next) => {
  try {
    const material = await prisma.materials.create({
      data: req.body,
    });
    res.json(material);
  } catch (error) {}
});

//Update Student
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateMaterials = await prisma.materials.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.json(updateMaterials);
  } catch (error) {
    next(error);
  }
});

//delete Student
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    deleteMaterials = await prisma.materials.delete({
      where: {
        id: id,
      },
    });
    res.json(deleteMaterials);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
