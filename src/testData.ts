import { ParsedSection } from './generate'

export const testData: ParsedSection[] = [
  {
    name: '516098 User Story: Sign Crossborder Payment | Step 4',
    node: {
      id: '880:17886',
      meta: {
        type: 'start',
        text: '',
      },
      next: [
        {
          id: '880:17888',
          meta: {
            type: 'serviceCall',
            text: 'business.payment.listdraftforeignpayment.v1_0\n',
          },
          next: [
            {
              id: '880:17892',
              meta: {
                type: 'output',
                text: '',
              },
              next: [],
            },
            {
              id: '880:17896',
              meta: {
                type: 'gateway',
                text: 'Error from service?',
              },
              next: [
                {
                  id: '880:17900',
                  meta: {
                    type: 'connector',
                    text: 'Error from service?:Connector line',
                  },
                  next: [
                    {
                      id: '880:17899',
                      meta: {
                        type: 'message',
                        text: 'Enter the page again? Retry?',
                      },
                      next: [],
                    },
                  ],
                },
                {
                  id: '882:15537',
                  meta: {
                    type: 'connector',
                    text: 'Error from service?:Connector line',
                  },
                  next: [
                    {
                      id: '882:15513',
                      meta: {
                        type: 'serviceCall',
                        text: 'Sign payment\n',
                      },
                      next: [
                        {
                          id: '882:15524',
                          meta: {
                            type: 'gateway',
                            text: 'Error from service?',
                          },
                          next: [
                            {
                              id: '882:15554',
                              meta: {
                                type: 'connector',
                                text: 'Error from service?:Connector line',
                              },
                              next: [
                                {
                                  id: '882:15440',
                                  meta: {
                                    type: 'serviceCall',
                                    text: 'business.payment.createForeignPayment.v1_0\n',
                                  },
                                  next: [
                                    {
                                      id: '882:15469',
                                      meta: {
                                        type: 'output',
                                        text: '',
                                      },
                                      next: [],
                                    },
                                    {
                                      id: '882:15497',
                                      meta: {
                                        type: 'gateway',
                                        text: 'Error from service?',
                                      },
                                      next: [
                                        {
                                          id: '882:15575',
                                          meta: {
                                            type: 'connector',
                                            text: 'Error from service?:Connector line',
                                          },
                                          next: [
                                            {
                                              id: '882:15509',
                                              meta: {
                                                type: 'message',
                                                text: 'Betalningen kunde inte genomföras',
                                              },
                                              next: [],
                                            },
                                          ],
                                        },
                                        {
                                          id: '882:15606',
                                          meta: {
                                            type: 'connector',
                                            text: 'Error from service?:Connector line',
                                          },
                                          next: [
                                            {
                                              id: '882:15595',
                                              next: [],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              id: '882:15571',
                              meta: {
                                type: 'connector',
                                text: 'Error from service?:Connector line',
                              },
                              next: [
                                {
                                  id: '882:15558',
                                  meta: {
                                    type: 'message',
                                    text: 'Betalningen kunde inte genomföras',
                                  },
                                  next: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: '501584 User Story: Draft Payment Summary View/Modal',
    node: {
      id: '1038:14462',
      meta: {
        type: 'start',
        text: '',
      },
      next: [
        {
          id: '1038:14561',
          meta: {
            type: 'message',
            text: 'Show payment details [  ]',
          },
          next: [
            {
              id: '859:14385',
              meta: {
                type: 'gateway',
                text: 'new payee',
              },
              next: [
                {
                  id: '1038:14620',
                  meta: {
                    type: 'connector',
                    text: 'new payee:No',
                  },
                  next: [
                    {
                      id: '1038:14727',
                      meta: {
                        type: 'script',
                        text: 'Set button to “Lägg till”',
                      },
                      next: [
                        {
                          id: '1039:13050',
                          meta: {
                            type: 'connector',
                            text: '',
                          },
                          next: [
                            {
                              id: '1038:14521',
                              meta: {
                                type: 'userAction',
                                text: 'action',
                              },
                              next: [
                                {
                                  id: '1038:14813',
                                  meta: {
                                    type: 'start',
                                    text: '',
                                  },
                                  next: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: '859:14393',
                  meta: {
                    type: 'connector',
                    text: 'new payee:Yes',
                  },
                  next: [
                    {
                      id: '1038:14754',
                      meta: {
                        type: 'script',
                        text: 'Set button to “Signera mottagare  och lägg till betalning”',
                      },
                      next: [
                        {
                          id: '1039:13050',
                          meta: {
                            type: 'connector',
                            text: '',
                          },
                          next: [
                            {
                              id: '1038:14521',
                              meta: {
                                type: 'userAction',
                                text: 'action',
                              },
                              next: [
                                {
                                  id: '1038:14813',
                                  meta: {
                                    type: 'start',
                                    text: '',
                                  },
                                  next: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: '550646 User Story: Lägg till button in summary modal/page',
    node: {
      id: '1038:15037',
      meta: {
        type: 'start',
        text: '',
      },
      next: [
        {
          id: '1039:13311',
          meta: {
            type: 'gateway',
            text: 'new payee',
          },
          next: [
            {
              id: '1038:15028',
              meta: {
                type: 'connector',
                text: 'new payee:Yes',
              },
              next: [
                {
                  id: '1039:13087',
                  meta: {
                    type: 'serviceCall',
                    text: 'Sign Payee',
                  },
                  next: [
                    {
                      id: '1039:13088',
                      meta: {
                        type: 'gateway',
                        text: 'Any errors?',
                      },
                      next: [
                        {
                          id: '1039:13090',
                          meta: {
                            type: 'connector',
                            text: 'Any errors?:Connector line',
                          },
                          next: [
                            {
                              id: '1039:13089',
                              meta: {
                                type: 'message',
                                text: 'text',
                              },
                              next: [],
                            },
                          ],
                        },
                        {
                          id: '1039:13102',
                          meta: {
                            type: 'connector',
                            text: 'Any errors?:Connector line',
                          },
                          next: [
                            {
                              id: '1039:13101',
                              meta: {
                                type: 'gateway',
                                text: 'Is save new recipient checkbox checked?',
                              },
                              next: [
                                {
                                  id: '1039:13103',
                                  meta: {
                                    type: 'connector',
                                    text: 'Is save new recipient checkbox checked?:Yes',
                                  },
                                  next: [
                                    {
                                      id: '1039:13091',
                                      meta: {
                                        type: 'serviceCall',
                                        text: 'Add Payee to db?',
                                      },
                                      next: [
                                        {
                                          id: '1039:13096',
                                          meta: {
                                            type: 'output',
                                            text: '',
                                          },
                                          next: [],
                                        },
                                        {
                                          id: '1039:13106',
                                          meta: {
                                            type: 'gateway',
                                            text: 'Any errors',
                                          },
                                          next: [
                                            {
                                              id: '1039:13117',
                                              meta: {
                                                type: 'connector',
                                                text: 'Any errors:Connector line',
                                              },
                                              next: [
                                                {
                                                  id: '1039:13114',
                                                  meta: {
                                                    type: 'connector',
                                                    text: '',
                                                  },
                                                  next: [
                                                    {
                                                      id: '1039:13080',
                                                      meta: {
                                                        type: 'serviceCall',
                                                        text: '/crossborder-payments/drafts',
                                                      },
                                                      next: [
                                                        {
                                                          id: '1039:13082',
                                                          meta: {
                                                            type: 'output',
                                                            text: '',
                                                          },
                                                          next: [],
                                                        },
                                                        {
                                                          id: '1039:13110',
                                                          meta: {
                                                            type: 'gateway',
                                                            text: 'Any errors?',
                                                          },
                                                          next: [
                                                            {
                                                              id: '1039:13112',
                                                              meta: {
                                                                type: 'connector',
                                                                text: 'Any errors?:Connector line',
                                                              },
                                                              next: [
                                                                {
                                                                  id: '1039:13111',
                                                                  meta: {
                                                                    type: 'message',
                                                                    text: 'text',
                                                                  },
                                                                  next: [],
                                                                },
                                                              ],
                                                            },
                                                            {
                                                              id: '1039:13119',
                                                              meta: {
                                                                type: 'connector',
                                                                text: 'Any errors?:Connector line',
                                                              },
                                                              next: [
                                                                {
                                                                  id: '1038:15156',
                                                                  meta: {
                                                                    type: 'script',
                                                                    text: 'Clear: Fields\nAccount data\nRecipient data\nPayment data',
                                                                  },
                                                                  next: [
                                                                    {
                                                                      id: '1051:13838',
                                                                      next: [],
                                                                    },
                                                                  ],
                                                                },
                                                              ],
                                                            },
                                                          ],
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                            {
                                              id: '1039:13109',
                                              meta: {
                                                type: 'connector',
                                                text: 'Any errors:Connector line',
                                              },
                                              next: [
                                                {
                                                  id: '1039:13108',
                                                  meta: {
                                                    type: 'message',
                                                    text: 'Notify user that Payee could not be saved',
                                                  },
                                                  next: [
                                                    {
                                                      id: '1039:13114',
                                                      meta: {
                                                        type: 'connector',
                                                        text: '',
                                                      },
                                                      next: [
                                                        {
                                                          id: '1039:13080',
                                                          meta: {
                                                            type: 'serviceCall',
                                                            text: '/crossborder-payments/drafts',
                                                          },
                                                          next: [
                                                            {
                                                              id: '1039:13082',
                                                              meta: {
                                                                type: 'output',
                                                                text: '',
                                                              },
                                                              next: [],
                                                            },
                                                            {
                                                              id: '1039:13110',
                                                              meta: {
                                                                type: 'gateway',
                                                                text: 'Any errors?',
                                                              },
                                                              next: [
                                                                {
                                                                  id: '1039:13112',
                                                                  meta: {
                                                                    type: 'connector',
                                                                    text: 'Any errors?:Connector line',
                                                                  },
                                                                  next: [
                                                                    {
                                                                      id: '1039:13111',
                                                                      meta: {
                                                                        type: 'message',
                                                                        text: 'text',
                                                                      },
                                                                      next: [],
                                                                    },
                                                                  ],
                                                                },
                                                                {
                                                                  id: '1039:13119',
                                                                  meta: {
                                                                    type: 'connector',
                                                                    text: 'Any errors?:Connector line',
                                                                  },
                                                                  next: [
                                                                    {
                                                                      id: '1038:15156',
                                                                      meta: {
                                                                        type: 'script',
                                                                        text: 'Clear: Fields\nAccount data\nRecipient data\nPayment data',
                                                                      },
                                                                      next: [
                                                                        {
                                                                          id: '1051:13838',
                                                                          next: [],
                                                                        },
                                                                      ],
                                                                    },
                                                                  ],
                                                                },
                                                              ],
                                                            },
                                                          ],
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  id: '1039:13115',
                                  meta: {
                                    type: 'connector',
                                    text: 'Is save new recipient checkbox checked?:No',
                                  },
                                  next: [
                                    {
                                      id: '1039:13114',
                                      meta: {
                                        type: 'connector',
                                        text: '',
                                      },
                                      next: [
                                        {
                                          id: '1039:13080',
                                          meta: {
                                            type: 'serviceCall',
                                            text: '/crossborder-payments/drafts',
                                          },
                                          next: [
                                            {
                                              id: '1039:13082',
                                              meta: {
                                                type: 'output',
                                                text: '',
                                              },
                                              next: [],
                                            },
                                            {
                                              id: '1039:13110',
                                              meta: {
                                                type: 'gateway',
                                                text: 'Any errors?',
                                              },
                                              next: [
                                                {
                                                  id: '1039:13112',
                                                  meta: {
                                                    type: 'connector',
                                                    text: 'Any errors?:Connector line',
                                                  },
                                                  next: [
                                                    {
                                                      id: '1039:13111',
                                                      meta: {
                                                        type: 'message',
                                                        text: 'text',
                                                      },
                                                      next: [],
                                                    },
                                                  ],
                                                },
                                                {
                                                  id: '1039:13119',
                                                  meta: {
                                                    type: 'connector',
                                                    text: 'Any errors?:Connector line',
                                                  },
                                                  next: [
                                                    {
                                                      id: '1038:15156',
                                                      meta: {
                                                        type: 'script',
                                                        text: 'Clear: Fields\nAccount data\nRecipient data\nPayment data',
                                                      },
                                                      next: [
                                                        {
                                                          id: '1051:13838',
                                                          next: [],
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: '1039:13095',
                      meta: {
                        type: 'output',
                        text: '',
                      },
                      next: [],
                    },
                  ],
                },
              ],
            },
            {
              id: '1038:15019',
              meta: {
                type: 'connector',
                text: 'new payee:No',
              },
              next: [
                {
                  id: '1039:13114',
                  meta: {
                    type: 'connector',
                    text: '',
                  },
                  next: [
                    {
                      id: '1039:13080',
                      meta: {
                        type: 'serviceCall',
                        text: '/crossborder-payments/drafts',
                      },
                      next: [
                        {
                          id: '1039:13082',
                          meta: {
                            type: 'output',
                            text: '',
                          },
                          next: [],
                        },
                        {
                          id: '1039:13110',
                          meta: {
                            type: 'gateway',
                            text: 'Any errors?',
                          },
                          next: [
                            {
                              id: '1039:13112',
                              meta: {
                                type: 'connector',
                                text: 'Any errors?:Connector line',
                              },
                              next: [
                                {
                                  id: '1039:13111',
                                  meta: {
                                    type: 'message',
                                    text: 'text',
                                  },
                                  next: [],
                                },
                              ],
                            },
                            {
                              id: '1039:13119',
                              meta: {
                                type: 'connector',
                                text: 'Any errors?:Connector line',
                              },
                              next: [
                                {
                                  id: '1038:15156',
                                  meta: {
                                    type: 'script',
                                    text: 'Clear: Fields\nAccount data\nRecipient data\nPayment data',
                                  },
                                  next: [
                                    {
                                      id: '1051:13838',
                                      next: [],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: '544555 User Story: Register Crossborder Payment Information',
    node: {
      id: '810:13903',
      meta: {
        type: 'start',
        text: '',
      },
      next: [
        {
          id: '816:13793',
          meta: {
            type: 'subprocess',
            text: 'Display:fields: Payment data',
          },
          next: [
            {
              id: '1828:13221',
              meta: {
                type: 'gateway',
                text: 'Country chosen?',
              },
              next: [
                {
                  id: '1828:13242',
                  meta: {
                    type: 'connector',
                    text: 'Country chosen?:Yes',
                  },
                  next: [
                    {
                      id: '1828:13229',
                      meta: {
                        type: 'gateway',
                        text: 'Is EuEesCountry?',
                      },
                      next: [
                        {
                          id: '1828:13263',
                          meta: {
                            type: 'connector',
                            text: 'Is EuEesCountry?:Yes',
                          },
                          next: [
                            {
                              id: '1830:13188',
                              meta: {
                                type: 'connector',
                                text: '',
                              },
                              next: [
                                {
                                  id: '2391:15043',
                                  meta: {
                                    type: 'script',
                                    text: 'Show betalningsreferens',
                                  },
                                  next: [
                                    {
                                      id: '1051:13719',
                                      meta: {
                                        type: 'script',
                                        text: 'Fee to non-changeable',
                                      },
                                      next: [
                                        {
                                          id: '1051:13612',
                                          meta: {
                                            type: 'note',
                                            text: 'Default view before customer\nhas selected any country (SEPA)',
                                          },
                                          next: [],
                                        },
                                        {
                                          id: '1828:13295',
                                          meta: {
                                            type: 'connector',
                                            text: '',
                                          },
                                          next: [
                                            {
                                              id: '810:14075',
                                              meta: {
                                                type: 'userAction',
                                                text: 'action',
                                              },
                                              next: [
                                                {
                                                  id: '811:15514',
                                                  meta: {
                                                    type: 'start',
                                                    text: '',
                                                  },
                                                  next: [],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: '1828:13284',
                          meta: {
                            type: 'connector',
                            text: 'Is EuEesCountry?:No',
                          },
                          next: [
                            {
                              id: '2391:15022',
                              meta: {
                                type: 'script',
                                text: 'Hide betalningsreferens',
                              },
                              next: [
                                {
                                  id: '1828:13267',
                                  meta: {
                                    type: 'script',
                                    text: 'Fee to changeable',
                                  },
                                  next: [
                                    {
                                      id: '1828:13295',
                                      meta: {
                                        type: 'connector',
                                        text: '',
                                      },
                                      next: [
                                        {
                                          id: '810:14075',
                                          meta: {
                                            type: 'userAction',
                                            text: 'action',
                                          },
                                          next: [
                                            {
                                              id: '811:15514',
                                              meta: {
                                                type: 'start',
                                                text: '',
                                              },
                                              next: [],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: '1830:13195',
                  meta: {
                    type: 'connector',
                    text: 'Country chosen?:No',
                  },
                  next: [
                    {
                      id: '1830:13188',
                      meta: {
                        type: 'connector',
                        text: '',
                      },
                      next: [
                        {
                          id: '2391:15043',
                          meta: {
                            type: 'script',
                            text: 'Show betalningsreferens',
                          },
                          next: [
                            {
                              id: '1051:13719',
                              meta: {
                                type: 'script',
                                text: 'Fee to non-changeable',
                              },
                              next: [
                                {
                                  id: '1051:13612',
                                  meta: {
                                    type: 'note',
                                    text: 'Default view before customer\nhas selected any country (SEPA)',
                                  },
                                  next: [],
                                },
                                {
                                  id: '1828:13295',
                                  meta: {
                                    type: 'connector',
                                    text: '',
                                  },
                                  next: [
                                    {
                                      id: '810:14075',
                                      meta: {
                                        type: 'userAction',
                                        text: 'action',
                                      },
                                      next: [
                                        {
                                          id: '811:15514',
                                          meta: {
                                            type: 'start',
                                            text: '',
                                          },
                                          next: [],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: '516078 User Story: Register New Payee',
    node: {
      id: '794:13956',
      meta: {
        type: 'start',
        text: '',
      },
      next: [
        {
          id: '1038:15243',
          meta: {
            type: 'subprocess',
            text: 'Display:fields: New recipient data',
          },
          next: [
            {
              id: '1038:15266',
              meta: {
                type: 'script',
                text: 'Hide BIC/SWIFT field\nAND\nset IBAN/BBAN label to IBAN',
              },
              next: [
                {
                  id: '1038:15296',
                  meta: {
                    type: 'note',
                    text: 'Default view before customer\nhas selected any country (SEPA)',
                  },
                  next: [],
                },
                {
                  id: '1038:15418',
                  meta: {
                    type: 'userAction',
                    text: 'action',
                  },
                  next: [
                    {
                      id: '794:13966',
                      meta: {
                        type: 'start',
                        text: '',
                      },
                      next: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: '516076 User Story: Select Payee | Step 2a',
    node: {
      id: '1051:12982',
      meta: {
        type: 'start',
        text: '',
      },
      next: [
        {
          id: '811:15402',
          meta: {
            type: 'script',
            text: 'Hide fields: New recipient data',
          },
          next: [
            {
              id: '1051:13092',
              meta: {
                type: 'message',
                text: 'Show payee information\n[USER_DEFINED_NAME]\nElse\n[Mottagarens fullständiga namn]\n',
              },
              next: [
                {
                  id: '1051:13036',
                  next: [],
                },
                {
                  id: '1331:12975',
                  meta: {
                    type: 'script',
                    text: 'Set dropdown to “Välj” (No preselection)',
                  },
                  next: [
                    {
                      id: '1051:13067',
                      meta: {
                        type: 'userAction',
                        text: 'action',
                      },
                      next: [
                        {
                          id: '1830:13101',
                          meta: {
                            type: 'start',
                            text: '',
                          },
                          next: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: '540466 User Story: Select Account',
    node: {
      id: '94:1203',
      meta: {
        type: 'start',
        text: '',
      },
      next: [
        {
          id: '94:1213',
          meta: {
            type: 'serviceCall',
            text: 'im/json/overview/getaccounts  -> ESB/bank/deposit/getAccounts/201411',
          },
          next: [
            {
              id: '94:1214',
              meta: {
                type: 'gateway',
                text: 'Error from service?',
              },
              next: [
                {
                  id: '94:1216',
                  meta: {
                    type: 'connector',
                    text: 'Error from service?:Yes',
                  },
                  next: [
                    {
                      id: '94:1215',
                      meta: {
                        type: 'message',
                        text: '',
                      },
                      next: [],
                    },
                  ],
                },
                {
                  id: '94:1219',
                  meta: {
                    type: 'connector',
                    text: 'Error from service?:Connector line',
                  },
                  next: [
                    {
                      id: '1050:13604',
                      meta: {
                        type: 'message',
                        text: 'Show fromAccounts \n[AccountNumber] [DefinedAccount][Name] [CurrentBalance]',
                      },
                      next: [
                        {
                          id: '94:1205',
                          meta: {
                            type: 'serviceCall',
                            text: 'bank/payment/crossborder/countries',
                          },
                          next: [
                            {
                              id: '94:1210',
                              meta: {
                                type: 'gateway',
                                text: 'Error from service?',
                              },
                              next: [
                                {
                                  id: '94:1212',
                                  meta: {
                                    type: 'connector',
                                    text: 'Error from service?:Yes',
                                  },
                                  next: [
                                    {
                                      id: '94:1211',
                                      meta: {
                                        type: 'message',
                                        text: '',
                                      },
                                      next: [],
                                    },
                                  ],
                                },
                                {
                                  id: '94:1223',
                                  meta: {
                                    type: 'connector',
                                    text: 'Error from service?:Connector line',
                                  },
                                  next: [
                                    {
                                      id: '94:1206',
                                      meta: {
                                        type: 'serviceCall',
                                        text: 'bank/payment/crossborder/currencies',
                                      },
                                      next: [
                                        {
                                          id: '94:1227',
                                          meta: {
                                            type: 'output',
                                            text: '',
                                          },
                                          next: [],
                                        },
                                        {
                                          id: '94:1207',
                                          meta: {
                                            type: 'gateway',
                                            text: 'Error from service?',
                                          },
                                          next: [
                                            {
                                              id: '94:1209',
                                              meta: {
                                                type: 'connector',
                                                text: 'Error from service?:Yes',
                                              },
                                              next: [
                                                {
                                                  id: '94:1208',
                                                  meta: {
                                                    type: 'message',
                                                    text: 'Could not load page',
                                                  },
                                                  next: [],
                                                },
                                              ],
                                            },
                                            {
                                              id: '94:1254',
                                              meta: {
                                                type: 'connector',
                                                text: 'Error from service?:Connector line',
                                              },
                                              next: [
                                                {
                                                  id: '1055:13995',
                                                  meta: {
                                                    type: 'connector',
                                                    text: '',
                                                  },
                                                  next: [
                                                    {
                                                      id: '94:1241',
                                                      meta: {
                                                        type: 'serviceCall',
                                                        text: 'Get saved foreign payees\n',
                                                      },
                                                      next: [
                                                        {
                                                          id: '94:1244',
                                                          meta: {
                                                            type: 'output',
                                                            text: '',
                                                          },
                                                          next: [],
                                                        },
                                                        {
                                                          id: '94:1251',
                                                          meta: {
                                                            type: 'gateway',
                                                            text: 'Error from service?',
                                                          },
                                                          next: [
                                                            {
                                                              id: '94:1253',
                                                              meta: {
                                                                type: 'connector',
                                                                text: 'Error from service?:Yes',
                                                              },
                                                              next: [
                                                                {
                                                                  id: '94:1252',
                                                                  meta: {
                                                                    type: 'message',
                                                                    text: 'Could not load page',
                                                                  },
                                                                  next: [],
                                                                },
                                                              ],
                                                            },
                                                            {
                                                              id: '1051:13897',
                                                              meta: {
                                                                type: 'connector',
                                                                text: 'Error from service?:Connector line',
                                                              },
                                                              next: [
                                                                {
                                                                  id: '791:13751',
                                                                  meta: {
                                                                    type: 'serviceCall',
                                                                    text: 'business.payment.listdraftforeignpayment.v1_0\n',
                                                                  },
                                                                  next: [
                                                                    {
                                                                      id: '791:13905',
                                                                      meta: {
                                                                        type: 'output',
                                                                        text: '',
                                                                      },
                                                                      next: [],
                                                                    },
                                                                    {
                                                                      id: '791:13837',
                                                                      meta: {
                                                                        type: 'gateway',
                                                                        text: 'Error from service?',
                                                                      },
                                                                      next: [
                                                                        {
                                                                          id: '791:13900',
                                                                          meta: {
                                                                            type: 'connector',
                                                                            text: 'Error from service?:Connector line',
                                                                          },
                                                                          next: [
                                                                            {
                                                                              id: '880:17486',
                                                                              meta: {
                                                                                type: 'message',
                                                                                text: 'Could not load page',
                                                                              },
                                                                              next: [],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          id: '1830:13248',
                                                                          meta: {
                                                                            type: 'connector',
                                                                            text: 'Error from service?:Connector line',
                                                                          },
                                                                          next: [
                                                                            {
                                                                              id: '1406:12997',
                                                                              meta: {
                                                                                type: 'gateway',
                                                                                text: 'Has recipients?',
                                                                              },
                                                                              next: [
                                                                                {
                                                                                  id: '1406:13000',
                                                                                  meta: {
                                                                                    type: 'connector',
                                                                                    text: 'Has recipients?:Yes',
                                                                                  },
                                                                                  next: [
                                                                                    {
                                                                                      id: '1406:12999',
                                                                                      meta: {
                                                                                        type: 'script',
                                                                                        text: 'Show radiobuttons\nNew/saved recipient',
                                                                                      },
                                                                                      next: [
                                                                                        {
                                                                                          id: '1406:12985',
                                                                                          next: [],
                                                                                        },
                                                                                        {
                                                                                          id: '1406:12980',
                                                                                          meta: {
                                                                                            type: 'userAction',
                                                                                            text: 'action',
                                                                                          },
                                                                                          next: [
                                                                                            {
                                                                                              id: '1406:12998',
                                                                                              meta: {
                                                                                                type: 'connector',
                                                                                                text: '',
                                                                                              },
                                                                                              next: [
                                                                                                {
                                                                                                  id: '1406:12987',
                                                                                                  meta: {
                                                                                                    type: 'subprocess',
                                                                                                    text: 'New payee information',
                                                                                                  },
                                                                                                  next: [
                                                                                                    {
                                                                                                      id: '1406:12986',
                                                                                                      meta: {
                                                                                                        type: 'subprocess',
                                                                                                        text: 'Payment information',
                                                                                                      },
                                                                                                      next: [
                                                                                                        {
                                                                                                          id: '1406:12988',
                                                                                                          meta: {
                                                                                                            type: 'gateway',
                                                                                                            text: 'Has draft foreign payments?',
                                                                                                          },
                                                                                                          next: [
                                                                                                            {
                                                                                                              id: '1406:12991',
                                                                                                              meta: {
                                                                                                                type: 'connector',
                                                                                                                text: 'Has draft foreign payments?:No',
                                                                                                              },
                                                                                                              next: [
                                                                                                                {
                                                                                                                  id: '1406:12990',
                                                                                                                  meta: {
                                                                                                                    type: 'connector',
                                                                                                                    text: '',
                                                                                                                  },
                                                                                                                  next: [
                                                                                                                    {
                                                                                                                      id: '1406:12994',
                                                                                                                      meta: {
                                                                                                                        type: 'start',
                                                                                                                        text: '',
                                                                                                                      },
                                                                                                                      next: [],
                                                                                                                    },
                                                                                                                  ],
                                                                                                                },
                                                                                                              ],
                                                                                                            },
                                                                                                            {
                                                                                                              id: '1406:12992',
                                                                                                              meta: {
                                                                                                                type: 'connector',
                                                                                                                text: 'Has draft foreign payments?:Yes',
                                                                                                              },
                                                                                                              next: [
                                                                                                                {
                                                                                                                  id: '1406:12989',
                                                                                                                  meta: {
                                                                                                                    type: 'subprocess',
                                                                                                                    text: 'Basket',
                                                                                                                  },
                                                                                                                  next: [
                                                                                                                    {
                                                                                                                      id: '1406:12990',
                                                                                                                      meta: {
                                                                                                                        type: 'connector',
                                                                                                                        text: '',
                                                                                                                      },
                                                                                                                      next: [
                                                                                                                        {
                                                                                                                          id: '1406:12994',
                                                                                                                          meta: {
                                                                                                                            type: 'start',
                                                                                                                            text: '',
                                                                                                                          },
                                                                                                                          next: [],
                                                                                                                        },
                                                                                                                      ],
                                                                                                                    },
                                                                                                                  ],
                                                                                                                },
                                                                                                              ],
                                                                                                            },
                                                                                                          ],
                                                                                                        },
                                                                                                      ],
                                                                                                    },
                                                                                                  ],
                                                                                                },
                                                                                              ],
                                                                                            },
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          id: '1406:13011',
                                                                                          meta: {
                                                                                            type: 'note',
                                                                                            text: 'Default radio button \nset to “Ny mottagare”',
                                                                                          },
                                                                                          next: [],
                                                                                        },
                                                                                      ],
                                                                                    },
                                                                                  ],
                                                                                },
                                                                                {
                                                                                  id: '1406:13004',
                                                                                  meta: {
                                                                                    type: 'connector',
                                                                                    text: 'Has recipients?:No',
                                                                                  },
                                                                                  next: [
                                                                                    {
                                                                                      id: '1406:13001',
                                                                                      meta: {
                                                                                        type: 'script',
                                                                                        text: 'Hide radiobuttons\nHide saved recipient dropdown',
                                                                                      },
                                                                                      next: [
                                                                                        {
                                                                                          id: '1406:12985',
                                                                                          next: [],
                                                                                        },
                                                                                        {
                                                                                          id: '1406:12998',
                                                                                          meta: {
                                                                                            type: 'connector',
                                                                                            text: '',
                                                                                          },
                                                                                          next: [
                                                                                            {
                                                                                              id: '1406:12987',
                                                                                              meta: {
                                                                                                type: 'subprocess',
                                                                                                text: 'New payee information',
                                                                                              },
                                                                                              next: [
                                                                                                {
                                                                                                  id: '1406:12986',
                                                                                                  meta: {
                                                                                                    type: 'subprocess',
                                                                                                    text: 'Payment information',
                                                                                                  },
                                                                                                  next: [
                                                                                                    {
                                                                                                      id: '1406:12988',
                                                                                                      meta: {
                                                                                                        type: 'gateway',
                                                                                                        text: 'Has draft foreign payments?',
                                                                                                      },
                                                                                                      next: [
                                                                                                        {
                                                                                                          id: '1406:12991',
                                                                                                          meta: {
                                                                                                            type: 'connector',
                                                                                                            text: 'Has draft foreign payments?:No',
                                                                                                          },
                                                                                                          next: [
                                                                                                            {
                                                                                                              id: '1406:12990',
                                                                                                              meta: {
                                                                                                                type: 'connector',
                                                                                                                text: '',
                                                                                                              },
                                                                                                              next: [
                                                                                                                {
                                                                                                                  id: '1406:12994',
                                                                                                                  meta: {
                                                                                                                    type: 'start',
                                                                                                                    text: '',
                                                                                                                  },
                                                                                                                  next: [],
                                                                                                                },
                                                                                                              ],
                                                                                                            },
                                                                                                          ],
                                                                                                        },
                                                                                                        {
                                                                                                          id: '1406:12992',
                                                                                                          meta: {
                                                                                                            type: 'connector',
                                                                                                            text: 'Has draft foreign payments?:Yes',
                                                                                                          },
                                                                                                          next: [
                                                                                                            {
                                                                                                              id: '1406:12989',
                                                                                                              meta: {
                                                                                                                type: 'subprocess',
                                                                                                                text: 'Basket',
                                                                                                              },
                                                                                                              next: [
                                                                                                                {
                                                                                                                  id: '1406:12990',
                                                                                                                  meta: {
                                                                                                                    type: 'connector',
                                                                                                                    text: '',
                                                                                                                  },
                                                                                                                  next: [
                                                                                                                    {
                                                                                                                      id: '1406:12994',
                                                                                                                      meta: {
                                                                                                                        type: 'start',
                                                                                                                        text: '',
                                                                                                                      },
                                                                                                                      next: [],
                                                                                                                    },
                                                                                                                  ],
                                                                                                                },
                                                                                                              ],
                                                                                                            },
                                                                                                          ],
                                                                                                        },
                                                                                                      ],
                                                                                                    },
                                                                                                  ],
                                                                                                },
                                                                                              ],
                                                                                            },
                                                                                          ],
                                                                                        },
                                                                                      ],
                                                                                    },
                                                                                  ],
                                                                                },
                                                                              ],
                                                                            },
                                                                          ],
                                                                        },
                                                                      ],
                                                                    },
                                                                  ],
                                                                },
                                                              ],
                                                            },
                                                          ],
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              id: '94:1226',
                              meta: {
                                type: 'output',
                                text: '',
                              },
                              next: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: '94:1225',
              meta: {
                type: 'output',
                text: '',
              },
              next: [],
            },
          ],
        },
      ],
    },
  },
  {
    name: '519207 User Story: Edit Draft Crossborder Payment | Step 4 (Feautre 2)',
    node: {
      id: '881:15252',
      meta: {
        type: 'start',
        text: '',
      },
      next: [
        {
          id: '881:15246',
          meta: {
            type: 'script',
            text: 'Show edit modal',
          },
          next: [
            {
              id: '881:15248',
              meta: {
                type: 'userAction',
                text: 'action',
              },
              next: [
                {
                  id: '881:15258',
                  meta: {
                    type: 'start',
                    text: '',
                  },
                  next: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: '519210 User Story | Delete Draft Crossborder Payment | Step 4 (Feautre 2)',
    node: {
      id: '881:14937',
      meta: {
        type: 'start',
        text: '',
      },
      next: [
        {
          id: '882:14940',
          meta: {
            type: 'script',
            text: 'Show confirmation modal',
          },
          next: [
            {
              id: '881:14882',
              meta: {
                type: 'userAction',
                text: 'action',
              },
              next: [
                {
                  id: '881:15007',
                  meta: {
                    type: 'start',
                    text: '',
                  },
                  next: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Feature 2',
    node: {
      id: '871:14507',
      meta: {
        type: 'start',
        text: '',
      },
      next: [
        {
          id: '882:14842',
          meta: {
            type: 'gatewayLoop',
            text: 'For each \n[draftPayment]',
          },
          next: [
            {
              id: '875:14699',
              meta: {
                type: 'script',
                text: 'Add total to sum',
              },
              next: [
                {
                  id: '880:17495',
                  meta: {
                    type: 'message',
                    text: 'Show top row payment details [Date, Payee Name, Account Number, Fee,  equivalentAmount]',
                  },
                  next: [
                    {
                      id: '880:17623',
                      next: [],
                    },
                    {
                      id: '881:14671',
                      meta: {
                        type: 'userAction',
                        text: 'action',
                      },
                      next: [
                        {
                          id: '880:17346',
                          meta: {
                            type: 'gateway',
                            text: 'More draft\nPayments?',
                          },
                          next: [
                            {
                              id: '880:17352',
                              meta: {
                                type: 'connector',
                                text: 'More draft\nPayments?:Connector line',
                              },
                              next: [
                                {
                                  id: '882:14842',
                                },
                              ],
                            },
                            {
                              id: '1038:15210',
                              meta: {
                                type: 'connector',
                                text: 'More draft\nPayments?:Connector line',
                              },
                              next: [
                                {
                                  id: '881:14765',
                                  meta: {
                                    type: 'userAction',
                                    text: 'action',
                                  },
                                  next: [
                                    {
                                      id: '881:15523',
                                      meta: {
                                        type: 'start',
                                        text: '',
                                      },
                                      next: [],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: '489875 User Story: Signera / lägg till button in register page',
    node: {
      id: '811:15801',
      meta: {
        type: 'start',
        text: '',
      },
      next: [
        {
          id: '811:15803',
          meta: {
            type: 'subprocess',
            text: 'Validate fields: Payment data',
          },
          next: [
            {
              id: '811:15839',
              meta: {
                type: 'subprocess',
                text: 'Validate fields: Recipient data',
              },
              next: [
                {
                  id: '811:15865',
                  meta: {
                    type: 'gateway',
                    text: 'Validation errors?',
                  },
                  next: [
                    {
                      id: '848:14403',
                      meta: {
                        type: 'connector',
                        text: 'Validation errors?:no',
                      },
                      next: [
                        {
                          id: '811:16080',
                          meta: {
                            type: 'serviceCall',
                            text: '/crossborder-payments',
                          },
                          next: [
                            {
                              id: '848:14618',
                              meta: {
                                type: 'output',
                                text: '',
                              },
                              next: [],
                            },
                            {
                              id: '816:14317',
                              meta: {
                                type: 'gateway',
                                text: 'Errors from /crossborder-payments?',
                              },
                              next: [
                                {
                                  id: '816:14319',
                                  meta: {
                                    type: 'connector',
                                    text: 'Errors from /crossborder-payments?:yes',
                                  },
                                  next: [
                                    {
                                      id: '816:14318',
                                      meta: {
                                        type: 'message',
                                        text: 'text',
                                      },
                                      next: [],
                                    },
                                  ],
                                },
                                {
                                  id: '1038:14445',
                                  meta: {
                                    type: 'connector',
                                    text: 'Errors from /crossborder-payments?:no',
                                  },
                                  next: [
                                    {
                                      id: '1038:14420',
                                      meta: {
                                        type: 'subprocess',
                                        text: 'payment summary',
                                      },
                                      next: [
                                        {
                                          id: '1038:14438',
                                          meta: {
                                            type: 'start',
                                            text: '',
                                          },
                                          next: [],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: '811:15936',
                      meta: {
                        type: 'connector',
                        text: 'Validation errors?:yes',
                      },
                      next: [
                        {
                          id: '811:15923',
                          meta: {
                            type: 'message',
                            text: 'Display correct errors for incorrect fields',
                          },
                          next: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
]
