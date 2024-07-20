const SubSchemas = {
  id: {
    isNumeric: {
      errorMessage: "Must Be Numeric"
    },
    isInt: {
      errorMessage: "Must Be An Integer"
    }
  },
  price: {
    isNumeric: {
      errorMessage: "Must Be Numeric"
    }
  },
  name: {
    isString: {
      errorMessage: "Must Be String"
    },
    notEmpty: {
      errorMessage: "Must Not Be Empty"
    },
    isLength: {
      options: {
        min: 3,
        max: 24
      },
      errorMessage: "Must Be Between 3-24 In Length"
    }
  },
  //* Optionals Start
  price_optional: {
    optional: true,
    isNumeric: {
      errorMessage: "Must Be Numeric"
    }
  },
  name_optional: {
    optional: true,
    isString: {
      errorMessage: "Must Be String"
    },
    notEmpty: {
      errorMessage: "Must Not Be Empty"
    },
    isLength: {
      options: {
        min: 3,
        max: 24
      },
      errorMessage: "Must Be Between 3-24 In Length"
    }
  },
  //* Optionals End
  count: {
    optional: true,
    isNumeric: {
      errorMessage: "Must Be Numeric"
    },
    isInt: {
      errorMessage: "Must Be An Integer"
    }
  }
}

const ProductDeletionSchema = {
  id: SubSchemas.id
}

const ProductGetterSchema = {
  count: SubSchemas.count
}

const ProductCreationSchema = {
  price: SubSchemas.price,
  name: SubSchemas.name
}

const ProductReplaceSchema = {
  price: SubSchemas.price,
  name: SubSchemas.name,
  id: SubSchemas.id
}

const ProductModifySchema = {
  price: SubSchemas.price_optional,
  name: SubSchemas.name_optional,
  id: SubSchemas.id
}

module.exports = {
  SubSchemas,
  Schemas: {
    ProductCreationSchema,
    ProductDeletionSchema,
    ProductGetterSchema,
    ProductModifySchema,
    ProductReplaceSchema
  }
}